import pg from "pg";
import dotenv from "dotenv";


dotenv.config();

const { Pool } = pg;

const required = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"];
for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Thiếu biến môi trường bắt buộc: ${key}`);
    }
}

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
});

// Client đang rảnh có thể gặp lỗi (ví dụ DB khởi động lại); chỉ ghi log thay vì để crash
pool.on("error", (error) => {
    console.error("❌ Lỗi pool PostgreSQL:", error);
});

// Kiểm tra kết nối một lần khi khởi động
export async function connectDB() {
    const client = await pool.connect();
    try {
        await client.query("SELECT 1");
        console.log("✅ PostgreSQL đã kết nối");
    } finally {
        client.release();
    }
}

// Tắt an toàn: đóng toàn bộ kết nối khi tiến trình nhận tín hiệu thoát
async function shutdown(signal: string) {
    console.log(`${signal} received, đang đóng pool PostgreSQL...`);
    try {
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi khi đóng pool:", error);
        process.exit(1);
    }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export const db = pool;