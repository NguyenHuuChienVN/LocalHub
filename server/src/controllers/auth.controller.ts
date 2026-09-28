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
}