import type { AuthUser } from "../../features/auth/authStorage";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rejected";

export type ServiceBooking = {
	id: string;
	serviceId: string;
	serviceName: string;
	providerName: string;
	date: string;
	time: string;
	location: string;
	notes: string | null;
	price: number;
	status: BookingStatus;
	review: { rating: number; comment: string } | null;
	createdAt: string;
};

type ApiResponse<T> = {
	success: boolean;
	message?: string;
	data?: T;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

async function request<T>(token: string, path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		cache: "no-store",
		headers: {
			...(init?.body ? { "Content-Type": "application/json" } : {}),
			Authorization: `Bearer ${token}`,
			...init?.headers,
		},
	});
	const result = await response.json().catch(() => null) as ApiResponse<T> | null;

	if (!response.ok || !result?.success || result.data === undefined) {
		throw new Error(result?.message || "Không thể hoàn tất yêu cầu đặt lịch. Vui lòng thử lại.");
	}

	return result.data;
}

export function createBooking(
	user: AuthUser,
	booking: { serviceId: string; date: string; time: string; location: string; notes: string },
): Promise<ServiceBooking> {
	if (!user.token) throw new Error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
	return request<ServiceBooking>(user.token, "/bookings", {
		method: "POST",
		body: JSON.stringify(booking),
	});
}

export function getMyBookings(token: string): Promise<ServiceBooking[]> {
	return request<ServiceBooking[]>(token, "/bookings");
}

export function deleteBooking(token: string, bookingId: string): Promise<{ id: string }> {
	return request<{ id: string }>(token, `/bookings/${encodeURIComponent(bookingId)}`, {
		method: "DELETE",
	});
}

export function reviewBooking(
	token: string,
	bookingId: string,
	review: { rating: number; comment: string },
): Promise<ServiceBooking> {
	return request<ServiceBooking>(token, `/bookings/${encodeURIComponent(bookingId)}/review`, {
		method: "POST",
		body: JSON.stringify(review),
	});
}

export function getProviderBookings(token: string): Promise<ServiceBooking[]> {
	return request<ServiceBooking[]>(token, "/provider/bookings");
}

export function updateProviderBooking(
	token: string,
	bookingId: string,
	status: "confirmed" | "rejected" | "completed",
): Promise<ServiceBooking> {
	return request<ServiceBooking>(token, `/provider/bookings/${encodeURIComponent(bookingId)}/status`, {
		method: "PATCH",
		body: JSON.stringify({ status }),
	});
}
