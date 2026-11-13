import { CalendarDays, CheckCircle2, Clock3, MapPin } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { createBooking } from "../../../api/services/bookings";
import { getAuthUser } from "../../../features/auth/authStorage";
import { popularServices } from "../../../features/services/mocks";

const bookingTimeSlots = Array.from({ length: 92 }, (_, index) => {
	const minutes = index * 15;
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
});

function parseDate(value: string): string | null {
	const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
	if (!match) return null;

	const [, day, month, year] = match;
	const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
	if (
		parsedDate.getUTCFullYear() !== Number(year) ||
		parsedDate.getUTCMonth() !== Number(month) - 1 ||
		parsedDate.getUTCDate() !== Number(day)
	) {
		return null;
	}

	return `${year}-${month}-${day}`;
}

export default function BookingPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const service = popularServices.find((item) => item.id === searchParams.get("serviceId"));
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");

	async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmitError("");
		const user = getAuthUser();
		if (!user?.token) {
			navigate("/login", { state: { from: `/bookings/new?serviceId=${encodeURIComponent(service?.id ?? "")}` } });
			return;
		}

		const formData = new FormData(event.currentTarget);
		const date = parseDate(String(formData.get("date")));
		const time = String(formData.get("time")).trim();
		if (!date) {
			setSubmitError("Ngày không hợp lệ. Vui lòng nhập lại.");
			return;
		}
		if (!/^([01]\d|2[0-2]):[0-5]\d$/.test(time)) {
			setSubmitError("Giờ không hợp lệ. Vui lòng nhập lại.");
			return;
		}

		setIsSubmitting(true);
		try {
			await createBooking(user, {
				serviceId: service!.id,
				date,
				time,
				location: String(formData.get("location")),
				notes: String(formData.get("notes") ?? ""),
			});
			setIsSubmitted(true);
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : "Không thể gửi yêu cầu đặt lịch.");
		} finally {
			setIsSubmitting(false);
		}
	}

	if (!service) {
		return <div className="mx-auto max-w-xl px-4 py-16 text-center"><h1 className="text-2xl font-black text-slate-950">Không tìm thấy dịch vụ</h1><Link className="mt-5 inline-block font-bold text-blue-600" to="/services">Quay lại danh sách</Link></div>;
	}

	if (isSubmitted) {
			return <div className="mx-auto max-w-lg px-4 py-12 text-center sm:py-20"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-8 w-8" /></div><h1 className="mt-5 text-2xl font-black text-slate-950">Đã lưu yêu cầu đặt lịch</h1><p className="mt-2 text-sm leading-6 text-slate-500">Đơn đã được lưu nhưng hiện chưa được phân công nhà cung cấp. Thời gian và chi phí cần được xác nhận.</p><Link className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700" to="/bookings">Xem đơn đặt dịch vụ</Link></div>;
	}

	return (
		<div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
			<Link className="text-sm font-bold text-slate-600" to={`/services/${service.id}`}>Quay lại dịch vụ</Link>
			<div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
				<p className="text-sm font-bold text-blue-600">Đặt lịch dịch vụ</p>
				<h1 className="mt-2 text-2xl font-black text-slate-950">{service.name}</h1>
				<p className="mt-1 text-sm text-slate-500">Đơn sẽ chờ phân công nhà cung cấp.</p>
				<p className="mt-2 text-sm text-slate-600">Giá tham khảo: {new Intl.NumberFormat("vi-VN").format(service.price)}đ. Đơn sẽ được lưu vào hệ thống đặt lịch.</p>
				<form className="mt-6 space-y-4" onSubmit={submitBooking}>
					<label className="block text-sm font-bold text-slate-700">Ngày<div className="relative mt-2"><CalendarDays className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input autoComplete="off" className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm" inputMode="numeric" name="date" placeholder="dd/mm/yyyy" required type="text" /></div><span className="mt-1 block text-xs font-normal text-slate-500">Nhập ngày theo định dạng ngày/tháng/năm.</span></label>
					<label className="block text-sm font-bold text-slate-700">Khung giờ<div className="relative mt-2"><Clock3 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" /><select className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm" defaultValue="" name="time" required><option disabled value="">Chọn giờ</option>{bookingTimeSlots.map((time) => <option key={time} value={time}>{time}</option>)}</select></div><span className="mt-1 block text-xs font-normal text-slate-500">Chọn khung giờ theo định dạng 24 giờ; các khung cách nhau 15 phút.</span></label>
					<label className="block text-sm font-bold text-slate-700">Địa chỉ<div className="relative mt-2"><MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm" name="location" required placeholder="Nhập địa chỉ sử dụng dịch vụ" /></div></label>
					<label className="block text-sm font-bold text-slate-700">Ghi chú<span className="font-normal text-slate-400"> (không bắt buộc)</span><textarea className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm" maxLength={1000} name="notes" placeholder="Mô tả thêm yêu cầu của bạn" /></label>
					{submitError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{submitError}</p>}
					<button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Đang gửi..." : "Gửi yêu cầu đặt lịch"}</button>
				</form>
			</div>
		</div>
	);
}