import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import { db } from "../config/db.ts";
import jwt, { SignOptions } from "jsonwebtoken";
import { checkAntiSpam, clearSuccessfulAttempt, recordFailedAttempt } from "../utils/antiSpam";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?\d{7,15}$/;

export const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const { fullName, email, password, phone } = req.body ??{};
        
        if (
        typeof fullName != "string" ||
        typeof email != "string" ||
        typeof password != "string" ||
        !fullName.trim() ||
        !email.trim() ||
        !password 
        ) {
        res.status(400).json({
            success: false,
            message: "Vui lòng nhập đủ thông tin"
        });
        return;
    }
    const cleaName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const antiSpamCheck = checkAntiSpam(req, normalizedEmail);
    if (!antiSpamCheck.allowed) {
        res.status(429).json({
            success: false,
            message: antiSpamCheck.message ?? "Quá nhiều lần thử sai. Vui lòng thử lại sau",
        });
        return;
    }

    if (cleaName.length > 100 || normalizedEmail.length > 255) {
        res.status(400).json({
            success: false,
            message: "Tên hoặc email quá dài"
        });
        return;
    }
    if ( !EMAIL_REGEX.test(normalizedEmail) ) {
        res.status(400).json({
            success: false,
            message: "Email không hợp lệ"
        });
        return;
    }
    if (password.length < 6 || Buffer.byteLength(password, "utf-8") > 72) {
        res.status(400).json({
            success: false,
            message: "Mật khẩu phải từ 6 ký tự trở lên"
        });
        return;
    }

    const cleanPhone = typeof phone === "string" && phone.trim() ? phone.trim() : null;
    if (cleanPhone && !/^\+?\d{7,15}$/.test(cleanPhone)) {
        res.status(400).json({
            success: false,
            message: "Số điện thoại không hợp lệ"
        });
        return;
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
        `INSERT INTO users (full_Name, email, password_hash, phone)
        VALUES ($1, $2, $3, $4)
        RETURNING id, full_Name, email, phone, created_at`,
        [cleaName, normalizedEmail, passwordHash, cleanPhone]
    );
    clearSuccessfulAttempt(req, normalizedEmail);
    res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
        data: result.rows[0]
    });
}
    catch (error: unknown) {
        if (
            typeof error === "object" &&
            error !== null && 
            "code" in error &&
            error.code === "23505" // mã lỗi unique_violation của PostgreSQL
        ) {
            res.status(400).json({
                success: false,
                message: "Email đã tồn tại"
            });
            return;
    }
    console.error("Lỗi khi đăng ký người dùng:", error);
    res.status(500).json({
        success: false,
        message: "Lỗi máy chủ, vui lòng thử lại sau"
    });
};
}

const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);
export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const { identifier: submittedIdentifier, email: legacyEmail, password } = req.body ?? {};
        const identifier = typeof submittedIdentifier === "string" ? submittedIdentifier : legacyEmail;
        if (
            typeof identifier !== "string" ||
            typeof password !== "string" ||
            !identifier.trim() ||
            !password
        ) {
            res.status(400).json({
                success:false,
                message: "Vui lòng nhập email hoặc số điện thoại và mật khẩu",
            })
            return;
        }
        const trimmedIdentifier = identifier.trim();
        const isEmail = EMAIL_REGEX.test(trimmedIdentifier);
        const isPhone = PHONE_REGEX.test(trimmedIdentifier);
        if (!isEmail && !isPhone) {
            res.status(400).json({
                success: false,
                message: "Email hoặc số điện thoại không hợp lệ",
            });
            return;
        }
        const normalizedIdentifier = isEmail ? trimmedIdentifier.toLowerCase() : trimmedIdentifier;

        const antiSpamCheck = checkAntiSpam(req, normalizedIdentifier);
        if (!antiSpamCheck.allowed) {
            res.status(429).json({
                success: false,
                message: antiSpamCheck.message ?? "Quá nhiều lần thử sai. Vui lòng thử lại sau",
            });
            return;
        }

        const result = await db.query(
            `SELECT id, full_name, email, password_hash, phone, avatar_url, date_of_birth, gender, city, district, address_line, bio, role, status
            FROM users
            WHERE ${isEmail ? "email" : "phone"} = $1
            LIMIT 2`,
            [normalizedIdentifier]
        );
        if (result.rows.length > 1) {
            res.status(409).json({
                success: false,
                message: "Số điện thoại đang gắn với nhiều tài khoản. Vui lòng thử lại",
            });
            return;
        }
        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user ? user.password_hash : DUMMY_HASH
        );

        if ( !user || !isMatch ) {
            recordFailedAttempt(req, normalizedIdentifier);
            res.status(401).json({
                success: false,
                message: "Email hoặc số điện thoại hoặc mật khẩu không đúng",
            });
            return;
        }
        if (user.status !== "active") {
            res.status(403).json({
                success: false,
                message: "Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt",
            });
            return;
        }
        const secrt = process.env.JWT_SECRET;
        if (!secrt) {
            throw new Error("Biến môi trường JWT_SECRET chưa được thiết lập");
        }
        clearSuccessfulAttempt(req, normalizedIdentifier);
        const token = jwt.sign({sub: user.id, role:user.role}, secrt, {
            expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
        });
        const { password_hash, ...userWithoutPassword } = user;
        res.json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
                user: userWithoutPassword,
                token,
            },
        });
    } catch (error: unknown){
        console.error("Lỗi khi đăng nhập:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ, vui lòng thử lại sau",
        });
    }
};


// PUT /api/users/me
export const updateMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.user.id;
        const {
            fullName,
            phone,
            birthDate,
            gender,
            city,
            district,
            address,
            bio,
            avatarUrl,
        } = req.body ?? {};

        const updates: Array<[string, string | null]> = [];
        if (fullName !== undefined && (typeof fullName !== "string" || !fullName.trim() || fullName.trim().length > 100)) {
            res.status(400).json({ success: false, message: "Họ tên phải từ 1 đến 100 ký tự" });
            return;
        }
        if (typeof fullName === "string") updates.push(["full_name", fullName.trim()]);

        if (phone !== undefined && phone !== null && typeof phone !== "string") {
            res.status(400).json({ success: false, message: "Số điện thoại không hợp lệ" });
            return;
        }
        const cleanPhone = typeof phone === "string" ? phone.trim() : null;
        if (cleanPhone && !PHONE_REGEX.test(cleanPhone)) {
            res.status(400).json({ success: false, message: "Số điện thoại không hợp lệ" });
            return;
        }
        if (phone !== undefined) updates.push(["phone", cleanPhone || null]);

        const optionalTextFields = [
            ["city", city, 100],
            ["district", district, 100],
            ["address_line", address, 250],
            ["bio", bio, 200],
        ] as const;
        for (const [column, value, maxLength] of optionalTextFields) {
            if (value !== undefined && value !== null && typeof value !== "string") {
                res.status(400).json({ success: false, message: "Dữ liệu hồ sơ không hợp lệ" });
                return;
            }
            if (typeof value === "string" && value.trim().length > maxLength) {
                res.status(400).json({ success: false, message: "Một số thông tin hồ sơ vượt quá độ dài cho phép" });
                return;
            }
            if (value !== undefined) {
                updates.push([column, typeof value === "string" ? value.trim() || null : null]);
            }
        }

        if (birthDate !== undefined && birthDate !== null && typeof birthDate !== "string") {
            res.status(400).json({ success: false, message: "Dữ liệu hồ sơ không hợp lệ" });
            return;
        }

        if (typeof birthDate === "string" && (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(Date.parse(`${birthDate}T00:00:00Z`)) || new Date(`${birthDate}T00:00:00Z`).toISOString().slice(0, 10) !== birthDate || birthDate > new Date().toISOString().slice(0, 10))) {
            res.status(400).json({ success: false, message: "Ngày sinh không hợp lệ" });
            return;
        }
        if (birthDate !== undefined) updates.push(["date_of_birth", birthDate || null]);

        if (gender !== undefined && gender !== null && gender !== "male" && gender !== "female" && gender !== "other") {
            res.status(400).json({ success: false, message: "Vui lòng chọn giới tính hợp lệ" });
            return;
        }
        if (gender !== undefined) updates.push(["gender", gender]);

        if (avatarUrl !== undefined && avatarUrl !== null && (typeof avatarUrl !== "string" || !/^https?:\/\//.test(avatarUrl))) {
            res.status(400).json({ success: false, message: "Ảnh đại diện phải là đường dẫn http(s)" });
            return;
        }
        if (avatarUrl !== undefined) {
            updates.push(["avatar_url", avatarUrl]);
            updates.push(["avatar_data", null]);
            updates.push(["avatar_mime_type", null]);
        }

        if (updates.length === 0) {
            res.status(400).json({ success: false, message: "Không có thông tin nào để cập nhật" });
            return;
        }

        const values = updates.map(([, value]) => value);
        const assignments = updates.map(([column], index) => `${column} = $${index + 1}`);
        values.push(userId);

        const result = await db.query(
            `UPDATE users SET ${assignments.join(", ")}, updated_at = now()
             WHERE id = $${values.length} AND status = 'active'
             RETURNING id, full_name, email, phone, avatar_url, date_of_birth, gender, city, district, address_line, bio, role, status, updated_at`,
            values
        );

        if (result.rows.length === 0) {
            res.status(401).json({ success: false, message: "Tài khoản không tồn tại hoặc đã bị khóa" });
            return;
        }

        res.json({ success: true, message: "Cập nhật thành công", data: result.rows[0] });
    } catch (error: unknown) {
        console.error("Lỗi khi cập nhật hồ sơ:", error);
        if (typeof error === "object" && error !== null && "code" in error && error.code === "42703") {
            res.status(503).json({
                success: false,
                message: "Database chưa có đủ các cột hồ sơ. Hãy chạy server/database/migrations/001_profile_details.sql trên database của LocalHub rồi thử lại.",
            });
            return;
        }
        res.status(500).json({ success: false, message: "Lỗi máy chủ, vui lòng thử lại sau" });
    }
};

export const uploadAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.user.id;
        const image = req.body?.image;
        const match = typeof image === "string"
            ? /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(image)
            : null;

        if (!match) {
            res.status(400).json({ success: false, message: "Vui lòng chọn ảnh JPEG, PNG hoặc WebP hợp lệ" });
            return;
        }

        const bytes = Buffer.from(match[2], "base64");
        const isValidImage = match[1] === "png"
            ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            : match[1] === "jpeg"
                ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
                : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";

        if (bytes.length > 2 * 1024 * 1024 || !isValidImage) {
            res.status(400).json({ success: false, message: "Ảnh không hợp lệ hoặc vượt quá dung lượng 2 MB" });
            return;
        }

        const avatarUrl = "/api/users/me/avatar";
        const result = await db.query(
            `UPDATE users
             SET avatar_url = $1,
                 avatar_data = $2,
                 avatar_mime_type = $3,
                 updated_at = now()
             WHERE id = $4 AND status = 'active'
             RETURNING avatar_url`,
            [avatarUrl, bytes, `image/${match[1]}`, userId]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ success: false, message: "Tài khoản không tồn tại hoặc đã bị khóa" });
            return;
        }

        res.json({ success: true, message: "Ảnh đại diện đã được cập nhật", data: { avatarUrl } });
    } catch (error: unknown) {
        console.error("Lỗi khi tải ảnh đại diện:", error);
        res.status(500).json({ success: false, message: "Không thể tải ảnh đại diện. Vui lòng thử lại sau" });
    }
};

export const getAvatar = async (_req: Request, res: Response): Promise<void> => {
    try {
        const result = await db.query(
            "SELECT avatar_data, avatar_mime_type FROM users WHERE id = $1 AND status = 'active'",
            [res.locals.user.id]
        );
        const avatar = result.rows[0];

        if (!avatar?.avatar_data || !avatar.avatar_mime_type) {
            res.status(404).json({ success: false, message: "Tài khoản chưa có ảnh đại diện" });
            return;
        }

        res.setHeader("Content-Type", avatar.avatar_mime_type);
        res.setHeader("Cache-Control", "private, no-store");
        res.send(avatar.avatar_data);
    } catch (error: unknown) {
        console.error("Lỗi khi tải ảnh đại diện:", error);
        res.status(500).json({ success: false, message: "Không thể tải ảnh đại diện. Vui lòng thử lại sau" });
    }
};

export const removeAvatar = async (_req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.user.id;
        const result = await db.query(
            `UPDATE users
             SET avatar_url = NULL,
                 avatar_data = NULL,
                 avatar_mime_type = NULL,
                 updated_at = now()
             WHERE id = $1 AND status = 'active'
             RETURNING id`,
            [userId]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ success: false, message: "Tài khoản không tồn tại hoặc đã bị khóa" });
            return;
        }

        res.json({ success: true, message: "Đã xóa ảnh đại diện" });
    } catch (error: unknown) {
        console.error("Lỗi khi xóa ảnh đại diện:", error);
        res.status(500).json({ success: false, message: "Không thể xóa ảnh đại diện. Vui lòng thử lại sau" });
    }
};

export const deactivateMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.user.id;
        const { currentPassword } = req.body ?? {};

        if (typeof currentPassword !== "string" || !currentPassword) {
            res.status(400).json({ success: false, message: "Vui lòng nhập mật khẩu để xác nhận" });
            return;
        }

        const result = await db.query(
            "SELECT password_hash FROM users WHERE id = $1 AND status = 'active'",
            [userId]
        );
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) {
            res.status(400).json({ success: false, message: "Mật khẩu không đúng" });
            return;
        }

        await db.query(
            "UPDATE users SET status = 'inactive', updated_at = now() WHERE id = $1",
            [userId]
        );

        res.json({ success: true, message: "Tài khoản đã được vô hiệu hóa" });
    } catch (error: unknown) {
        console.error("Lỗi khi vô hiệu hóa tài khoản:", error);
        res.status(500).json({ success: false, message: "Không thể vô hiệu hóa tài khoản. Vui lòng thử lại sau" });
    }
};

// PUT /api/users/me/password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.user.id;
        const { currentPassword, newPassword } = req.body ?? {};

        if (
            typeof currentPassword !== "string" ||
            typeof newPassword !== "string" ||
            !currentPassword ||
            !newPassword
        ) {
            res.status(400).json({ success: false, message: "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới" });
            return;
        }

        if (newPassword.length < 6 || Buffer.byteLength(newPassword, "utf-8") > 72) {
            res.status(400).json({ success: false, message: "Mật khẩu mới phải từ 6 ký tự và tối đa 72 byte" });
            return;
        }

        if (newPassword === currentPassword) {
            res.status(400).json({ success: false, message: "Mật khẩu mới phải khác mật khẩu hiện tại" });
            return;
        }

        const result = await db.query(
            "SELECT password_hash FROM users WHERE id = $1 AND status = 'active'",
            [userId]
        );
        const user = result.rows[0];

        if (!user) {
            res.status(401).json({ success: false, message: "Tài khoản không tồn tại hoặc đã bị khóa" });
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            res.status(400).json({ success: false, message: "Mật khẩu hiện tại không đúng" });
            return;
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        await db.query(
            "UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2",
            [newHash, userId]
        );

        res.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error: unknown) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ, vui lòng thử lại sau" });
    }
};