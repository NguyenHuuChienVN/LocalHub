import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import { db } from "../config/db.ts";
import jwt, { SignOptions } from "jsonwebtoken";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        const { email, password } = req.body ?? {};
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            res.status(400).json({
                success:false,
                message: "Vui lòng nhập email và mật khẩu",
            })
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();

        const result = await db.query(
            `SELECT id, full_name, email, password_hash, phone, avatar_url, role, status
            FROM users
            WHERE email = $1`,
            [normalizedEmail]
        );
        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user ? user.password_hash : DUMMY_HASH
        );
        if ( !user || !isMatch ) {
            res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không đúng",
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
        const { fullName, phone, avatarUrl } = req.body ?? {};

        // Trường nào có gửi lên thì phải là chuỗi
        for (const value of [fullName, phone, avatarUrl]) {
            if (value !== undefined && typeof value !== "string") {
                res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ" });
                return;
            }
        }

        if (fullName === undefined && phone === undefined && avatarUrl === undefined) {
            res.status(400).json({ success: false, message: "Không có thông tin nào để cập nhật" });
            return;
        }

        const cleanName = fullName?.trim();
        if (fullName !== undefined && (!cleanName || cleanName.length > 100)) {
            res.status(400).json({ success: false, message: "Họ tên phải từ 1 đến 100 ký tự" });
            return;
        }

        const cleanPhone = phone?.trim();
        if (cleanPhone && !/^[0-9+]{9,15}$/.test(cleanPhone)) {
            res.status(400).json({ success: false, message: "Số điện thoại không hợp lệ" });
            return;
        }

        const cleanAvatar = avatarUrl?.trim();
        if (cleanAvatar && !/^https?:\/\//.test(cleanAvatar)) {
            res.status(400).json({ success: false, message: "Ảnh đại diện phải là đường dẫn http(s)" });
            return;
        }

        // COALESCE: giá trị null nghĩa là "giữ nguyên cột cũ"
        const result = await db.query(
            `UPDATE users
             SET full_name  = COALESCE($1, full_name),
                 phone      = COALESCE($2, phone),
                 avatar_url = COALESCE($3, avatar_url),
                 updated_at = now()
             WHERE id = $4 AND status = 'active'
             RETURNING id, full_name, email, phone, avatar_url, role, status, updated_at`,
            [cleanName ?? null, cleanPhone || null, cleanAvatar || null, userId]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ success: false, message: "Tài khoản không tồn tại hoặc đã bị khóa" });
            return;
        }

        res.json({ success: true, message: "Cập nhật thành công", data: result.rows[0] });
    } catch (error: unknown) {
        console.error("Lỗi khi cập nhật hồ sơ:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ, vui lòng thử lại sau" });
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