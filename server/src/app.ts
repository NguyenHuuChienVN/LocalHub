import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes.ts";

import { pool as db } from "./config/db";
import { cacheResponse, invalidateCacheByPrefix } from "./utils/cache";

const app = express();

const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Quá nhiều request từ máy chủ của bạn, vui lòng thử lại sau",
    },
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
});

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Bạn đang gửi quá nhiều yêu cầu đăng nhập/đăng ký. Vui lòng thử lại sau 10 phút",
    },
    keyGenerator: (req) => {
        const forwarded = req.headers["x-forwarded-for"];
        const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded ?? req.socket.remoteAddress ?? "unknown";
        return String(ip);
    },
});

app.use(cors());
app.use(express.json({ limit: "3mb" }));
app.use(generalLimiter);
app.use(cacheResponse({ ttlSeconds: 180 }));

app.use("/api/users", userRoutes);
app.use("/api/auth", authLimiter, authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "server đang chạy" });
});

app.post("/api/cache/invalidate", (req, res) => {
    const prefix = typeof req.body?.prefix === "string" ? req.body.prefix : "";

    if (!prefix) {
        res.status(400).json({
            success: false,
            message: "Thiếu prefix để xóa cache",
        });
        return;
    }

    invalidateCacheByPrefix(prefix);
    res.json({
        success: true,
        message: "Cache đã được xóa",
        data: { prefix },
    });
});

app.get("/api/health", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");

        res.json({
            success: true,
            database: "connected",
            time: result.rows[0].now,
        });
    } catch (error) {
        console.error("Health check lỗi:", error);

        res.status(500).json({
            success: false,
            database: "disconnected",
        });
    }
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng http://localhost:${PORT}`);
});