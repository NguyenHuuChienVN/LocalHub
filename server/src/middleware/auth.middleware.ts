import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../config/db.ts";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Header có dạng: Authorization: Bearer <token>
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Vui lòng đăng nhập để tiếp tục",
        });
        return;
    }

    const token = header.slice(7); // bỏ chữ "Bearer "

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("Thiếu JWT_SECRET trong file .env");
        res.status(500).json({ success: false, message: "Lỗi máy chủ" });
        return;
    }

    let payload: jwt.JwtPayload;
    try {
        const decoded = jwt.verify(token, secret);
        if (typeof decoded === "string" || !decoded.sub) {
            res.status(401).json({ success: false, message: "Token không hợp lệ" });
            return;
        }
        payload = decoded;
    } catch {
        res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn",
        });
        return;
    }

    try {
        const result = await db.query(
            "SELECT id, role FROM users WHERE id = $1 AND status = 'active'",
            [payload.sub]
        );
        const user = result.rows[0];
        if (!user) {
            res.status(401).json({ success: false, message: "Tài khoản không tồn tại hoặc đã bị khóa" });
            return;
        }
        res.locals.user = { id: user.id, role: user.role };
        next();
    } catch (error: unknown) {
        console.error("Lỗi khi xác thực tài khoản:", error);
        res.status(500).json({ success: false, message: "Không thể xác thực tài khoản" });
    }
};

// Middleware phân quyền: chỉ cho phép các role được liệt kê
export const authorize =
    (...roles: string[]) =>
    (req: Request, res: Response, next: NextFunction): void => {
        if (!roles.includes(res.locals.user?.role)) {
            res.status(403).json({
                success: false,
                message: "Bạn không có quyền thực hiện thao tác này",
            });
            return;
        }
        next();
    };