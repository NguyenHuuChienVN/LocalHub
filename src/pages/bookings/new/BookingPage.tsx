import { CalendarDays, CheckCircle2, Clock3, MapPin } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { popularServices } from "../../../features/services/mocks";

export default function BookingPage() {
	const [searchParams] = useSearchParams();
	const service = popularServices.find((item) => item.id === searchParams.get("serviceId"));
	const [isSubmitted, setIsSubmitted] = useState(false);

	if (!service) {
		return <div className="mx-auto max-w-xl px-4 py-16 text-center"><h1 className="text-2xl font-black text-slate-950">Không tìm thấy dịch vụ</h1><Link className="mt-5 inline-block font-bold text-blue-600" to="/services">Quay lại danh sách</Link></div>;
	}

	if (isSubmitted) {
		return <div className="mx-auto max-w-lg px-4 py-12 text-center sm:py-20"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-8 w-8" /></div><h1 className="mt-5 text-2xl font-black text-slate-950">Đã nhận yêu cầu đặt lịch</h1><p className="mt-2 text-sm leading-6 text-slate-500">{service.provider} sẽ liên hệ với bạn để xác nhận thời gian và chi phí.</p><Link className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white" to="/">Về trang chủ</Link></div>;
	}

	return (
		<div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
			<Link className="text-sm font-bold text-slate-600" to={`/services/${service.id}`}>Quay lại dịch vụ</Link>
			<div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
				<p className="text-sm font-bold text-blue-600">Đặt lịch dịch vụ</p>
				<h1 className="mt-2 text-2xl font-black text-slate-950">{service.name}</h1>
				<p className="mt-1 text-sm text-slate-500">{service.provider}</p>
				<form className="mt-6 space-y-4" onSubmit={(event) => { event.preventDefault(); setIsSubmitted(true); }}>
					<label className="block text-sm font-bold text-slate-700">Ngày mong muốn<div className="relative mt-2"><CalendarDays className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm" required type="date" /></div></label>
					<label className="block text-sm font-bold text-slate-700">Khung giờ<div className="relative mt-2"><Clock3 className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm" required type="time" /></div></label>
					<label className="block text-sm font-bold text-slate-700">Địa chỉ<div className="relative mt-2"><MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm" required placeholder="Nhập địa chỉ sử dụng dịch vụ" /></div></label>
					<label className="block text-sm font-bold text-slate-700">Ghi chú<span className="font-normal text-slate-400"> (không bắt buộc)</span><textarea className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm" placeholder="Mô tả thêm yêu cầu của bạn" /></label>
					<button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700" type="submit">Gửi yêu cầu đặt lịch</button>
				</form>
			</div>
		</div>
	);
}