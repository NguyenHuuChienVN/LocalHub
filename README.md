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

API xác thực cần database và bảng `users` với các cột `id`, `full_name`, `email`, `password_hash`, `phone`, `avatar_url`, `role`, `status`, `created_at` và `updated_at`. Email cần unique; tài khoản đăng nhập cần có `status` là `active`.

Trên database đã có bảng `users`, mở lần lượt các file migration trong `server/database/migrations` bằng công cụ quản lý PostgreSQL (ví dụ pgAdmin Query Tool), chọn đúng database mà `server/.env` đang cấu hình và chạy toàn bộ nội dung từng file theo thứ tự số.

Migration `001` thêm thông tin hồ sơ; migration `002` thêm cột BYTEA để lưu ảnh đại diện trong PostgreSQL và xóa liên kết tới ảnh cũ trong `uploads/avatars`. Không có file ảnh nào được ghi vào thư mục source code. Sao lưu database sẽ bao gồm cả ảnh đại diện.

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
| `PUT` | `/api/users/me` | Cập nhật hồ sơ (JWT) |
| `GET` / `POST` / `DELETE` | `/api/users/me/avatar` | Xem / tải lên / xóa ảnh đại diện lưu trong PostgreSQL (JWT) |
| `PUT` | `/api/users/me/password` | Đổi mật khẩu (JWT) |
| `DELETE` | `/api/users/me` | Vô hiệu hóa tài khoản sau khi xác nhận mật khẩu (JWT) |

## Kiểm tra frontend

```bash
pnpm build
pnpm lint
```
