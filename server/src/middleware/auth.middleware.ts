import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
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

    try {
        const payload = jwt.verify(token, secret);

        if (typeof payload === "string" || !payload.sub) {
            res.status(401).json({ success: false, message: "Token không hợp lệ" });
            return;
        }

        // Lưu thông tin user để controller phía sau dùng
        res.locals.user = { id: payload.sub, role: payload.role };
        next();
    } catch {
        // Token sai chữ ký, bị sửa, hoặc đã hết hạn
        res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn",
        });
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