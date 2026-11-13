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

Trên database đã có bảng `users` và `service_bookings`, mở migration `server/database/migrations/004_localhub_booking_columns.sql` bằng công cụ quản lý PostgreSQL (ví dụ pgAdmin Query Tool), chọn đúng database mà `server/.env` đang cấu hình và chạy toàn bộ nội dung migration. Migration bổ sung các cột UUID và thông tin hiển thị vào `service_bookings`, giữ nguyên các cột và dữ liệu cũ.

Migration `001` thêm thông tin hồ sơ; migration `002` thêm cột BYTEA để lưu ảnh đại diện trong PostgreSQL và xóa liên kết tới ảnh cũ trong `uploads/avatars`. Thông tin tên dịch vụ/nhà cung cấp và giá tham khảo hiện được xác định ở server trong `server/src/config/bookingServices.ts`; API không nhận giá do trình duyệt gửi. Dữ liệu dịch vụ và nhà cung cấp trên giao diện vẫn là dữ liệu mẫu, chưa được nối với các bảng `services` và `providers`.

Chỉ tài khoản có `role = 'provider'` mới được gọi API nhà cung cấp. Hiện `providers` và `services` chưa có dữ liệu, nên cần tích hợp các bảng này để phân công và xử lý đơn thật; đơn mới vẫn được lưu trong `service_bookings` với trạng thái chờ.

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

Trạng thái đăng nhập được kiểm tra với phiên khởi động của API. Nếu API bị tắt, khởi động lại hoặc không phản hồi, ứng dụng sẽ tự đăng xuất; khi ứng dụng đang mở, việc kiểm tra diễn ra định kỳ và khi quay lại tab.

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
| `GET` / `POST` | `/api/bookings` | Xem đơn của mình / tạo đơn (JWT) |
| `DELETE` | `/api/bookings/:bookingId` | Xóa vĩnh viễn đơn chờ/đã xác nhận của mình (JWT) |
| `POST` | `/api/bookings/:bookingId/review` | Đánh giá đơn đã hoàn thành (JWT) |
| `GET` / `PATCH` | `/api/provider/bookings` / `:bookingId/status` | Xem đơn được giao / cập nhật trạng thái (JWT nhà cung cấp) |

Giá đơn được tra từ danh sách dịch vụ phía server, không tin giá do trình duyệt gửi. Đơn mới được ghi vào `service_bookings` với nhà cung cấp chưa phân công; đơn cũ trong bảng vẫn được giữ nguyên. Cần tích hợp bảng nhà cung cấp trước khi đơn mới có thể xuất hiện trong dashboard nhà cung cấp.

## Kiểm tra frontend

```bash
pnpm build
pnpm lint
```
