# LocalHub

LocalHub là ứng dụng tìm kiếm và đặt dịch vụ tại địa phương. Giao diện hiện sử dụng dữ liệu mẫu cho một số dịch vụ và nhà cung cấp; API Express cung cấp đăng ký, đăng nhập và kiểm tra kết nối PostgreSQL.

## Công nghệ

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Package manager: pnpm

## Yêu cầu

- Node.js và pnpm
- PostgreSQL

## Cài đặt

Từ thư mục gốc, cài dependencies frontend:

```bash
pnpm install
```

Cài dependencies backend:

```bash
cd server
pnpm install
```

## Cấu hình backend

Tạo file môi trường riêng từ file mẫu:

```powershell
Copy-Item server/.env.example server/.env
```

Sửa `server/.env` với thông tin PostgreSQL và JWT secret của bạn. Không commit file `.env`; chỉ commit `.env.example` và không điền secrets thật vào đó.

API xác thực cần database và bảng `users` với các cột `id`, `full_name`, `email`, `password_hash`, `phone`, `avatar_url`, `role`, `status`, `created_at`. Email cần unique; tài khoản đăng nhập cần có `status` là `active`. Repo hiện chưa có migration/schema để tự tạo bảng này.

## Chạy ứng dụng

Chạy frontend từ thư mục gốc:

```bash
pnpm dev
```

Chạy backend trong terminal khác:

```bash
cd server
pnpm dev
```

Frontend mặc định tại `http://localhost:5173`; API mặc định tại `http://localhost:5000`.

## API

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `GET` | `/` | Kiểm tra API đang chạy |
| `GET` | `/api/health` | Kiểm tra kết nối PostgreSQL |
| `POST` | `/api/auth/register` | Đăng ký tài khoản |
| `POST` | `/api/auth/login` | Đăng nhập, trả về JWT |

## Kiểm tra frontend

```bash
pnpm build
pnpm lint
```
