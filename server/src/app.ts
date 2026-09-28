import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";

import { pool as db } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "server đang chạy" });
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