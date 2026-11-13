import { CalendarDays, CalendarX2, CheckCircle2, ChevronRight, MapPin, MessageCircle, RotateCcw, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { deleteBooking, getMyBookings, reviewBooking, type BookingStatus, type ServiceBooking } from "../../../api/services/bookings";
import { getAuthUser } from "../../../features/auth/authStorage";
import { addServiceReview } from "../../../features/services/serviceReviewStorage";

type BookingFilter = "all" | "upcoming" | "completed" | "cancelled";

const filters: { id: BookingFilter; label: string }[] = [
	{ id: "all", label: "Tất cả" },
	{ id: "upcoming", label: "Sắp tới" },
	{ id: "completed", label: "Hoàn thành" },
	{ id: "cancelled", label: "Đã hủy / từ chối" },
];

const statusLabels: Record<BookingStatus, string> = {
	pending: "Chờ xác nhận",
	confirmed: "Đã xác nhận",
	completed: "Hoàn thành",
	cancelled: "Đã hủy",
	rejected: "Đã từ chối",
};

const statusStyles: Record<BookingStatus, string> = {
	pending: "bg-amber-100 text-amber-800",
	confirmed: "bg-blue-100 text-blue-800",
	completed: "bg-emerald-100 text-emerald-800",
	cancelled: "bg-slate-100 text-slate-600",
	rejected: "bg-red-100 text-red-700",
};

function formatPrice(price: number) {
	return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}

function formatDate(date: string) {
	const parsedDate = new Date(`${date}T00:00:00`);
	return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(parsedDate);
}

function matchesFilter(booking: ServiceBooking, filter: BookingFilter) {
	if (filter === "upcoming") return booking.status === "pending" || booking.status === "confirmed";
	if (filter === "cancelled") return booking.status === "cancelled" || booking.status === "rejected";
	if (filter === "all") return true;
	return booking.status === filter;
}

export default function BookingsPage() {
	const [token] = useState(() => getAuthUser()?.token ?? "");
	const [bookings, setBookings] = useState<ServiceBooking[]>([]);
	const [filter, setFilter] = useState<BookingFilter>("all");
	const [reviewingId, setReviewingId] = useState<string | null>(null);
	const [reviewRating, setReviewRating] = useState("5");
	const [reviewComment, setReviewComment] = useState("");
	const [reviewSubmitError, setReviewSubmitError] = useState("");
	const [pageError, setPageError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const visibleBookings = bookings.filter((booking) => matchesFilter(booking, filter));
	const counts: Record<BookingFilter, number> = {
		all: bookings.length,
		upcoming: bookings.filter((booking) => booking.status === "pending" || booking.status === "confirmed").length,
		completed: bookings.filter((booking) => booking.status === "completed").length,
		cancelled: bookings.filter((booking) => booking.status === "cancelled" || booking.status === "rejected").length,
	};

	useEffect(() => {
		let isMounted = true;
		if (!token) {
			setPageError("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
			setIsLoading(false);
			return () => { isMounted = false; };
		}

		void getMyBookings(token)
			.then((items) => {
				if (isMounted) setBookings(items);
			})
			.catch((error: unknown) => {
				if (isMounted) setPageError(error instanceof Error ? error.message : "Không thể tải đơn đặt dịch vụ.");
			})
			.finally(() => {
				if (isMounted) setIsLoading(false);
			});
		return () => { isMounted = false; };
	}, [token]);

	async function handleDeleteBooking(bookingId: string) {
		if (!window.confirm("Bạn có chắc chắn muốn hủy đơn này?")) return;

		setPageError("");
		setUpdatingId(bookingId);
		try {
			const deleted = await deleteBooking(token, bookingId);
			setBookings((current) => current.map((booking) => (
				booking.id === deleted.id ? { ...booking, status: "cancelled" } : booking
			)));
		} catch (error) {
			setPageError(error instanceof Error ? error.message : "Không thể hủy đơn lúc này.");
		} finally {
			setUpdatingId(null);
		}
	}

	async function submitReview(event: React.FormEvent<HTMLFormElement>, booking: ServiceBooking) {
		event.preventDefault();
		setReviewSubmitError("");
		try {
			const updated = await reviewBooking(token, booking.id, {
				rating: Number(reviewRating),
				comment: reviewComment.trim(),
			});
			const user = getAuthUser();
			if (user) {
				try {
					addServiceReview(booking.serviceId, {
						name: user.name,
						email: user.email,
						rating: Number(reviewRating),
						comment: reviewComment.trim(),
					});
				} catch {
					setReviewSubmitError("Đánh giá đã được lưu cho đơn, nhưng chưa cập nhật được danh sách đánh giá dịch vụ.");
				}
			}
			setBookings((current) => current.map((item) => item.id === updated.id ? updated : item));
			setReviewingId(null);
			setReviewComment("");
		} catch (error) {
			setReviewSubmitError(error instanceof Error ? error.message : "Không thể lưu đánh giá lúc này.");
		}
	}

	return (
		<div className="min-h-[calc(100vh-136px)] bg-white px-4 py-8 text-slate-900 sm:px-8 sm:py-10">
			<div className="mx-auto max-w-5xl">
				<div className="flex flex-wrap items-end justify-between gap-3">
					<div><h1 className="text-xl font-black text-slate-900">Đơn đặt dịch vụ</h1><p className="mt-1 text-sm text-slate-500">Theo dõi lịch hẹn và trạng thái dịch vụ của bạn.</p></div>
					<Link className="text-sm font-bold text-blue-600 hover:text-blue-700" to="/services">Đặt dịch vụ mới</Link>
				</div>

				{pageError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{pageError}</p>}
				{isLoading ? <p className="py-16 text-center text-sm text-slate-500">Đang tải đơn đặt dịch vụ...</p> : bookings.length === 0 ? (
					<section className="mt-4 flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
						<div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600"><CalendarX2 className="h-7 w-7" /></div>
						<h2 className="mt-4 text-lg font-black text-slate-900">Bạn chưa có đơn đặt dịch vụ nào</h2>
						<p className="mt-1 max-w-md text-sm leading-5 text-slate-500">Khám phá các dịch vụ gần bạn và đặt lịch chỉ trong vài phút.</p>
						<Link className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700" to="/services">Khám phá dịch vụ <ChevronRight className="h-4 w-4" /></Link>
					</section>
				) : <>
					<div aria-label="Lọc đơn đặt dịch vụ" className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-200" role="tablist">
						{filters.map((item) => <button aria-selected={filter === item.id} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition ${filter === item.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`} key={item.id} onClick={() => setFilter(item.id)} role="tab" type="button">{item.label}<span className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${filter === item.id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{counts[item.id]}</span></button>)}
					</div>
					<div className="mt-4 space-y-3">
						{visibleBookings.length === 0 ? <section className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><p className="font-bold text-slate-800">Chưa có đơn trong mục này</p><p className="mt-1 text-sm text-slate-500">Bạn có thể xem lại các đơn ở bộ lọc khác.</p></section> : visibleBookings.map((booking) => (
							<article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" key={booking.id}>
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div className="min-w-0"><h2 className="font-bold text-slate-900">{booking.serviceName}</h2><p className="mt-0.5 text-sm text-slate-500">{booking.providerName}</p></div>
									<span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[booking.status]}`}>{statusLabels[booking.status]}</span>
								</div>
								<div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
									<span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-slate-400" />{formatDate(booking.date)}, {booking.time}</span>
									<span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" />{booking.location}</span>
								</div>
								{booking.notes && <p className="mt-2 text-sm text-slate-500">Ghi chú: {booking.notes}</p>}
								<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
									<strong className="text-sm text-slate-900">{formatPrice(booking.price)}</strong>
									<div className="flex flex-wrap gap-2">
										{(booking.status === "pending" || booking.status === "confirmed") && <>
											<Link className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700" to="/support"><MessageCircle className="h-3.5 w-3.5" /> Nhắn tin</Link>
											<button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-600 disabled:opacity-60" disabled={updatingId === booking.id} onClick={() => void handleDeleteBooking(booking.id)} type="button"><X className="h-3.5 w-3.5" /> {updatingId === booking.id ? "Đang xóa..." : "Hủy đơn"}</button>
										</>}
										{booking.status === "completed" && !booking.review && <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700" onClick={() => { setReviewingId(booking.id); setReviewRating("5"); setReviewSubmitError(""); }} type="button"><Star className="h-3.5 w-3.5" /> Đánh giá</button>}
										{booking.review && <span className="inline-flex min-h-9 items-center gap-1.5 px-2 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Đã đánh giá ({booking.review.rating}/5)</span>}
										{(booking.status === "cancelled" || booking.status === "rejected") && <Link className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700" to={`/services/${encodeURIComponent(booking.serviceId)}`}><RotateCcw className="h-3.5 w-3.5" /> Đặt lại</Link>}
									</div>
								</div>
								{reviewingId === booking.id && <form className="mt-4 space-y-3 border-t border-slate-100 pt-4" onSubmit={(event) => void submitReview(event, booking)}>
									<label className="block text-sm font-bold text-slate-700">Điểm đánh giá<select className="ml-3 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900" onChange={(event) => setReviewRating(event.target.value)} value={reviewRating}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} sao</option>)}</select></label>
									<label className="block text-sm font-bold text-slate-700">Nhận xét<textarea className="mt-1.5 min-h-20 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm font-normal text-slate-900 placeholder:text-slate-400" maxLength={1000} onChange={(event) => setReviewComment(event.target.value)} placeholder="Chia sẻ trải nghiệm của bạn" required value={reviewComment} /></label>
									{reviewSubmitError && <p className="text-sm text-red-700" role="alert">{reviewSubmitError}</p>}
									<div className="flex justify-end gap-2"><button className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100" onClick={() => setReviewingId(null)} type="button">Đóng</button><button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700" type="submit">Gửi đánh giá</button></div>
								</form>}
							</article>
						))}
					</div>
				</>}
			</div>
		</div>
	);
}
