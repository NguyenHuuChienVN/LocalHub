import type { Request, Response } from "express";
import { db } from "../config/db.ts";
import { bookingServices } from "../config/bookingServices.ts";

type BookingRow = {
    id: string;
    service_id: string;
    service_name: string;
    provider_name: string;
    scheduled_date: string;
    scheduled_time: string;
    location: string;
    notes: string | null;
    price: string;
    status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
    review_rating: number | null;
    review_comment: string | null;
    created_at: Date;
};

function serializeBooking(row: BookingRow) {
    return {
        id: row.id,
        serviceId: row.service_id,
        serviceName: row.service_name,
        providerName: row.provider_name,
        date: row.scheduled_date,
        time: row.scheduled_time.slice(0, 5),
        location: row.location,
        notes: row.notes,
        price: Number(row.price),
        status: row.status,
        review: row.review_rating === null
            ? null
            : { rating: row.review_rating, comment: row.review_comment ?? "" },
        createdAt: row.created_at,
    };
}

const bookingFields = `
    id::text AS id, service_key AS service_id, service_name, provider_name,
    booking_date::text AS scheduled_date, start_time::text AS scheduled_time,
    location, customer_note AS notes, total_price::text AS price, status,
    review_rating, review_comment, created_at
`;

function isValidDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isFutureBookingTime(date: string, time: string): boolean {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(new Date());
    const current = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const currentDate = `${current.year}-${current.month}-${current.day}`;
    const currentTime = `${current.hour}:${current.minute}`;

    return date > currentDate || (date === currentDate && time > currentTime);
}

function respondWithBookingError(res: Response, error: unknown, context: string, message: string): void {
    console.error(context, error);
    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error.code === "42P01" || error.code === "42703")
    ) {
        res.status(503).json({
            success: false,
            message: "Bảng service_bookings chưa có đủ cột cần thiết. Hãy chạy server/database/migrations/004_localhub_booking_columns.sql rồi thử lại.",
        });
        return;
    }
    res.status(500).json({ success: false, message });
}

export async function createBooking(req: Request, res: Response): Promise<void> {
    const { serviceId, date, time, location, notes } = req.body ?? {};
    if (
        typeof serviceId !== "string" ||
        !/^[a-z0-9-]{1,80}$/.test(serviceId) ||
        typeof date !== "string" ||
        !isValidDate(date) ||
        typeof time !== "string" ||
        !/^([01]\d|2[0-2]):[0-5]\d$/.test(time) ||
        !isFutureBookingTime(date, time) ||
        typeof location !== "string" ||
        !location.trim() ||
        location.trim().length > 250 ||
        (notes !== undefined && notes !== null && (typeof notes !== "string" || notes.trim().length > 1000))
    ) {
        res.status(400).json({ success: false, message: "Thông tin đặt lịch không hợp lệ" });
        return;
    }

    const service = bookingServices[serviceId];
    if (!service) {
        res.status(404).json({ success: false, message: "Dịch vụ không tồn tại" });
        return;
    }

    try {
        const result = await db.query<BookingRow>(
            `INSERT INTO service_bookings (
                customer_uuid, provider_uuid, service_key, service_name, provider_name,
                booking_date, start_time, end_time, location, customer_note, total_price
            )
            VALUES (
                $1, NULL, $2, $3, $4, $5::date, $6::time, $6::time + interval '1 hour',
                $7, $8, $9
            )
            RETURNING ${bookingFields}`,
            [
                res.locals.user.id,
                serviceId,
                service.name,
                "Chưa phân công",
                date,
                time,
                location.trim(),
                typeof notes === "string" ? notes.trim() || null : null,
                service.price,
            ],
        );

        res.status(201).json({
            success: true,
            message: "Đã gửi yêu cầu đặt lịch",
            data: serializeBooking(result.rows[0]),
        });
    } catch (error: unknown) {
        respondWithBookingError(res, error, "Lỗi khi tạo đơn đặt dịch vụ:", "Không thể tạo đơn đặt dịch vụ lúc này");
    }
}

export async function getMyBookings(_req: Request, res: Response): Promise<void> {
    try {
        const result = await db.query<BookingRow>(
            `SELECT ${bookingFields}
             FROM service_bookings
             WHERE customer_uuid = $1
             ORDER BY created_at DESC`,
            [res.locals.user.id],
        );
        res.setHeader("Cache-Control", "private, no-store");
        res.json({ success: true, data: result.rows.map(serializeBooking) });
    } catch (error: unknown) {
        respondWithBookingError(res, error, "Lỗi khi tải đơn đặt dịch vụ:", "Không thể tải đơn đặt dịch vụ lúc này");
    }
}

export async function deleteMyBooking(req: Request, res: Response): Promise<void> {
    const bookingId = req.params.bookingId;
    if (typeof bookingId !== "string" || !/^[1-9]\d{0,18}$/.test(bookingId)) {
        res.status(400).json({ success: false, message: "Mã đơn không hợp lệ" });
        return;
    }

    try {
        const result = await db.query<{ id: string }>(
            `DELETE FROM service_bookings
             WHERE id = $1::bigint AND customer_uuid = $2 AND status IN ('pending', 'confirmed')
             RETURNING id::text AS id`,
            [bookingId, res.locals.user.id],
        );
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: "Không tìm thấy đơn hoặc đơn không thể hủy" });
            return;
        }
        res.json({ success: true, data: { id: result.rows[0].id } });
    } catch (error: unknown) {
        respondWithBookingError(res, error, "Lỗi khi hủy đơn đặt dịch vụ:", "Không thể hủy đơn lúc này");
    }
}

export async function getProviderBookings(_req: Request, res: Response): Promise<void> {
    try {
        const result = await db.query<BookingRow>(
            `SELECT ${bookingFields}
             FROM service_bookings
             WHERE provider_uuid = $1
             ORDER BY created_at DESC`,
            [res.locals.user.id],
        );
        res.setHeader("Cache-Control", "private, no-store");
        res.json({ success: true, data: result.rows.map(serializeBooking) });
    } catch (error: unknown) {
        respondWithBookingError(res, error, "Lỗi khi tải đơn của nhà cung cấp:", "Không thể tải đơn của nhà cung cấp lúc này");
    }
}

export async function updateProviderBookingStatus(req: Request, res: Response): Promise<void> {
    const bookingId = req.params.bookingId;
    const nextStatus = req.body?.status;
    if (
        typeof bookingId !== "string" ||
        !/^[1-9]\d{0,18}$/.test(bookingId) ||
        (nextStatus !== "confirmed" && nextStatus !== "rejected" && nextStatus !== "completed")
    ) {
        res.status(400).json({ success: false, message: "Trạng thái đơn không hợp lệ" });
        return;
    }

    try {
        const result = await db.query<BookingRow>(
            `UPDATE service_bookings AS booking
             SET status = $2, updated_at = now()
             WHERE booking.id = $1::bigint
               AND booking.provider_uuid = $3
               AND (
                   (booking.status = 'pending' AND $2 IN ('confirmed', 'rejected'))
                   OR (booking.status = 'confirmed' AND $2 = 'completed')
               )
             RETURNING booking.id::text AS id, booking.service_key AS service_id,
                       booking.service_name, booking.provider_name,
                       booking.booking_date::text AS scheduled_date,
                       booking.start_time::text AS scheduled_time, booking.location,
                       booking.customer_note AS notes, booking.total_price::text AS price,
                       booking.status, booking.review_rating,
                       booking.review_comment, booking.created_at`,
            [bookingId, nextStatus, res.locals.user.id],
        );
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: "Không tìm thấy đơn hoặc trạng thái không thể cập nhật" });
            return;
        }
        res.json({ success: true, data: serializeBooking(result.rows[0]) });
    } catch (error: unknown) {
        respondWithBookingError(res, error, "Lỗi khi cập nhật trạng thái đơn:", "Không thể cập nhật đơn lúc này");
    }
}

export async function reviewMyBooking(req: Request, res: Response): Promise<void> {
    const { rating, comment } = req.body ?? {};
    const bookingId = req.params.bookingId;
    if (
        typeof bookingId !== "string" ||
        !/^[1-9]\d{0,18}$/.test(bookingId) ||
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5 ||
        typeof comment !== "string" ||
        !comment.trim() ||
        comment.trim().length > 1000
    ) {
        res.status(400).json({ success: false, message: "Nội dung đánh giá không hợp lệ" });
        return;
    }

    try {
        const result = await db.query<BookingRow>(
            `UPDATE service_bookings
             SET review_rating = $3, review_comment = $4, updated_at = now()
             WHERE id = $1::bigint AND customer_uuid = $2
               AND status = 'completed' AND review_rating IS NULL
             RETURNING ${bookingFields}`,
            [bookingId, res.locals.user.id, rating, comment.trim()],
        );
        if (result.rows.length === 0) {
            res.status(409).json({ success: false, message: "Đơn chưa hoàn thành, không tồn tại hoặc đã được đánh giá" });
            return;
        }
        res.json({ success: true, data: serializeBooking(result.rows[0]) });
    } catch (error: unknown) {
        respondWithBookingError(res, error, "Lỗi khi lưu đánh giá đơn:", "Không thể lưu đánh giá lúc này");
    }
}
