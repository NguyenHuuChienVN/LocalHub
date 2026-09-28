import { CalendarDays, CalendarX2, CheckCircle2, ChevronRight, MapPin, MessageCircle, RotateCcw, Star, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { getAuthUser } from "../../../features/auth/authStorage";
import { getBookings, updateBooking, type BookingStatus, type ServiceBooking } from "../../../features/bookings/bookingStorage";
import { popularServices } from "../../../features/services/mocks";

type BookingFilter = "all" | "upcoming" | "completed" | "cancelled";

const filters: { id: BookingFilter; label: string }[] = [
	{ id: "all", label: "Tất cả" },
	{ id: "upcoming", label: "Sắp tới" },
	{ id: "completed", label: "Hoàn thành" },
	{ id: "cancelled", label: "Đã hủy" },
];

const statusLabels: Record<BookingStatus, string> = {
	pending: "Chờ xác nhận",
	confirmed: "Đã xác nhận",
	completed: "Hoàn thành",
	cancelled: "Đã hủy",
};

const statusStyles: Record<BookingStatus, string> = {
	pending: "bg-amber-100 text-amber-800",
	confirmed: "bg-blue-100 text-blue-800",
	completed: "bg-emerald-100 text-emerald-800",
	cancelled: "bg-slate-100 text-slate-600",
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
	if (filter === "all") return true;
	return booking.status === filter;
}

export default function BookingsPage() {
	const email = getAuthUser()?.email ?? "";
	const [bookings, setBookings] = useState(() => getBookings(email));
	const [filter, setFilter] = useState<BookingFilter>("all");
	const [reviewingId, setReviewingId] = useState<string | null>(null);
	const [reviewRating, setReviewRating] = useState("5");
	const [reviewComment, setReviewComment] = useState("");
	const visibleBookings = bookings.filter((booking) => matchesFilter(booking, filter));
	const counts = {
		all: bookings.length,
		upcoming: bookings.filter((booking) => booking.status === "pending" || booking.status === "confirmed").length,
		completed: bookings.filter((booking) => booking.status === "completed").length,
		cancelled: bookings.filter((booking) => booking.status === "cancelled").length,
	};

	function changeStatus(bookingId: string, status: BookingStatus) {
		setBookings(updateBooking(email, bookingId, { status }));
	}

	function submitReview(event: React.FormEvent<HTMLFormElement>, bookingId: string) {
		event.preventDefault();
		setBookings(updateBooking(email, bookingId, { review: { rating: Number(reviewRating), comment: reviewComment.trim() } }));
		setReviewingId(null);
		setReviewComment("");
	}

	if (bookings.length === 0) {
		return (
			<div className="min-h-[calc(100vh-136px)] bg-white px-4 py-8 text-slate-900 sm:px-8 sm:py-10">
				<div className="mx-auto max-w-5xl">
					<h1 className="text-xl font-black text-slate-900">Đơn đặt dịch vụ</h1>
					<section className="mt-4 flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
						<div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600"><CalendarX2 className="h-7 w-7" /></div>
						<h2 className="mt-4 text-lg font-black text-slate-900">Bạn chưa có đơn đặt dịch vụ nào</h2>
						<p className="mt-1 max-w-md text-sm leading-5 text-slate-500">Khám phá các dịch vụ gần bạn và đặt lịch chỉ trong vài phút.</p>
						<Link className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700" to="/services">Khám phá dịch vụ <ChevronRight className="h-4 w-4" /></Link>
					</section>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[calc(100vh-136px)] bg-white px-4 py-8 text-slate-900 sm:px-8 sm:py-10">
			<div className="mx-auto max-w-5xl">
				<div className="flex flex-wrap items-end justify-between gap-3">
					<div><h1 className="text-xl font-black text-slate-900">Đơn đặt dịch vụ</h1><p className="mt-1 text-sm text-slate-500">Theo dõi lịch hẹn và trạng thái dịch vụ của bạn.</p></div>
					<Link className="text-sm font-bold text-blue-600 hover:text-blue-700" to="/services">Đặt dịch vụ mới</Link>
				</div>

				<div aria-label="Lọc đơn đặt dịch vụ" className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-200" role="tablist">
					{filters.map((item) => <button aria-selected={filter === item.id} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition ${filter === item.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`} key={item.id} onClick={() => setFilter(item.id)} role="tab" type="button">{item.label}<span className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${filter === item.id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{counts[item.id]}</span></button>)}
				</div>  

				<div className="mt-4 space-y-3">
					{visibleBookings.length === 0 ? <section className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><p className="font-bold text-slate-800">Chưa có đơn trong mục này</p><p className="mt-1 text-sm text-slate-500">Bạn có thể xem lại các đơn ở bộ lọc khác.</p></section> : visibleBookings.map((booking) => {
						const service = popularServices.find((item) => item.id === booking.serviceId);
						if (!service) return null;
						return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div className="min-w-0"><h2 className="font-bold text-slate-900">{service.name}</h2><p className="mt-0.5 text-sm text-slate-500">{service.provider}</p></div>
								<span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[booking.status]}`}>{statusLabels[booking.status]}</span>
							</div>
							<div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
								<span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-slate-400" />{formatDate(booking.date)}, {booking.time}</span>
								<span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" />{booking.location}</span>
							</div>
							<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
								<strong className="text-sm text-slate-900">{formatPrice(booking.price)}</strong>
								<div className="flex flex-wrap gap-2">
									{booking.status === "pending" && <>
										<Link className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700" to="/support"><MessageCircle className="h-3.5 w-3.5" /> Nhắn tin</Link>
										<button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-white bg-red-500 transition hover:bg-red-600" onClick={() => changeStatus(booking.id, "cancelled")} type="button"><X className="h-3.5 w-3.5" /> Hủy đơn</button>
									</>}
									{booking.status === "confirmed" && <Link className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700" to="/support"><MessageCircle className="h-3.5 w-3.5" /> Nhắn tin</Link>}
									{booking.status === "completed" && !booking.review && <button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700" onClick={() => { setReviewingId(booking.id); setReviewRating("5"); }} type="button"><Star className="h-3.5 w-3.5" /> Đánh giá</button>}
									{booking.status === "completed" && booking.review && <span className="inline-flex min-h-9 items-center gap-1.5 px-2 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Đã đánh giá</span>}
									{booking.status === "cancelled" && <Link className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700" to={`/services/${service.id}`}><RotateCcw className="h-3.5 w-3.5" /> Đặt lại</Link>}
								</div>
							</div>
							{reviewingId === booking.id && <form className="mt-4 space-y-3 border-t border-slate-100 pt-4" onSubmit={(event) => submitReview(event, booking.id)}>
								<label className="block text-sm font-bold text-slate-700">Điểm đánh giá<select className="ml-3 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900" onChange={(event) => setReviewRating(event.target.value)} value={reviewRating}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} sao</option>)}</select></label>
								<label className="block text-sm font-bold text-slate-700">Nhận xét<textarea className="mt-1.5 min-h-20 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm font-normal text-slate-900 placeholder:text-slate-400" onChange={(event) => setReviewComment(event.target.value)} placeholder="Chia sẻ trải nghiệm của bạn" required value={reviewComment} /></label>
								<div className="flex justify-end gap-2"><button className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100" onClick={() => setReviewingId(null)} type="button">Đóng</button><button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700" type="submit">Gửi đánh giá</button></div>
							</form>}
						</article>;
					})}
				</div>
			</div>
		</div>
	);
}