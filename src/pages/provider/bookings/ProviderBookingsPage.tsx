import { CalendarDays, Check, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getProviderBookings, updateProviderBooking, type BookingStatus, type ServiceBooking } from "../../../api/services/bookings";
import { getAuthUser } from "../../../features/auth/authStorage";

const statusLabels: Record<BookingStatus, string> = {
	pending: "Chờ xử lý",
	confirmed: "Đã xác nhận",
	completed: "Hoàn thành",
	cancelled: "Khách đã hủy",
	rejected: "Đã từ chối",
};

export default function ProviderBookingsPage() {
	const [token] = useState(() => getAuthUser()?.token ?? "");
	const [bookings, setBookings] = useState<ServiceBooking[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;
		if (!token) {
			setError("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
			setIsLoading(false);
			return () => { isMounted = false; };
		}

		void getProviderBookings(token)
			.then((items) => {
				if (isMounted) setBookings(items);
			})
			.catch((requestError: unknown) => {
				if (isMounted) setError(requestError instanceof Error ? requestError.message : "Không thể tải đơn của nhà cung cấp.");
			})
			.finally(() => {
				if (isMounted) setIsLoading(false);
			});
		return () => { isMounted = false; };
	}, [token]);

	async function updateStatus(bookingId: string, status: "confirmed" | "rejected" | "completed") {
		setError("");
		setUpdatingId(bookingId);
		try {
			const updated = await updateProviderBooking(token, bookingId, status);
			setBookings((current) => current.map((booking) => booking.id === updated.id ? updated : booking));
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "Không thể cập nhật đơn lúc này.");
		} finally {
			setUpdatingId(null);
		}
	}

	return (
		<div className="min-h-[calc(100vh-136px)] bg-slate-50 px-4 py-8 text-slate-900 sm:px-8 sm:py-10">
			<section className="mx-auto max-w-5xl">
				<h1 className="text-2xl font-black">Yêu cầu đặt dịch vụ</h1>
				<p className="mt-1 text-sm text-slate-500">Xem và cập nhật trạng thái các đơn được giao cho bạn.</p>
				{error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
				{isLoading ? <p className="py-16 text-center text-sm text-slate-500">Đang tải đơn...</p> : bookings.length === 0 ? (
					<div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
						<p className="font-bold">Chưa có đơn được giao cho tài khoản này</p>
						<p className="mt-2 text-sm text-slate-500">Tài khoản cần có vai trò nhà cung cấp và được gán với dịch vụ trong cơ sở dữ liệu.</p>
					</div>
				) : <div className="mt-5 space-y-3">
					{bookings.map((booking) => <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" key={booking.id}>
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div><h2 className="font-bold">{booking.serviceName}</h2><p className="mt-1 text-sm text-slate-500">{booking.providerName}</p></div>
							<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{statusLabels[booking.status]}</span>
						</div>
						<div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
							<span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-slate-400" />{booking.date}, {booking.time}</span>
							<span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" />{booking.location}</span>
						</div>
						{booking.notes && <p className="mt-2 text-sm text-slate-500">Ghi chú: {booking.notes}</p>}
						<p className="mt-3 font-bold">{new Intl.NumberFormat("vi-VN").format(booking.price)}đ</p>
						{booking.status === "pending" && <div className="mt-4 flex flex-wrap justify-end gap-2">
							<button className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-60" disabled={updatingId === booking.id} onClick={() => void updateStatus(booking.id, "rejected")} type="button"><X className="h-4 w-4" /> Từ chối</button>
							<button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60" disabled={updatingId === booking.id} onClick={() => void updateStatus(booking.id, "confirmed")} type="button"><Check className="h-4 w-4" /> Xác nhận</button>
						</div>}
						{booking.status === "confirmed" && <div className="mt-4 flex justify-end">
							<button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={updatingId === booking.id} onClick={() => void updateStatus(booking.id, "completed")} type="button"><Check className="h-4 w-4" /> Đánh dấu hoàn thành</button>
						</div>}
					</article>)}
				</div>}
			</section>
		</div>
	);
}
