import { ArrowLeft, CalendarDays, CheckCircle2, MapPin, Star } from "lucide-react";
import { Link, useParams } from "react-router";
import { popularServices } from "../../../features/services/mocks";

function formatPrice(price: number) {
	return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}

export default function ServiceDetailPage() {
	const { serviceId } = useParams();
	const service = popularServices.find((item) => item.id === serviceId);

	if (!service) {
		return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-black">Không tìm thấy dịch vụ</h1><Link className="mt-5 inline-block font-bold text-blue-600" to="/services">Quay lại danh sách</Link></div>;
	}

	return (
		<div className="mx-10 py-8 max-sm:mx-4 max-sm:py-5">
			<Link className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600" to="/services"><ArrowLeft className="h-4 w-4" /> Tất cả dịch vụ</Link>
			<div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
				<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><img className="h-80 w-full object-cover max-sm:h-56" src={service.image} alt={service.name} /><div className="p-6"><p className="text-sm font-bold text-blue-600">{service.category}</p><h1 className="mt-2 text-3xl font-black text-slate-950 max-sm:text-2xl">{service.name}</h1><p className="mt-2 text-slate-500">Cung cấp bởi <strong className="text-slate-800">{service.provider}</strong></p><div className="mt-5 flex items-center gap-2 text-sm"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><strong>{service.rating}</strong><span className="text-slate-500">({service.reviewCount} đánh giá)</span></div><div className="mt-7 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3"><div className="flex gap-2 text-sm text-slate-600"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> Nhà cung cấp đã xác minh</div><div className="flex gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4 shrink-0 text-blue-600" /> Phục vụ tại địa phương</div><div className="flex gap-2 text-sm text-slate-600"><CalendarDays className="h-4 w-4 shrink-0 text-blue-600" /> Đặt lịch linh hoạt</div></div></div></div>
				<aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Giá từ</p><strong className="mt-1 block text-2xl font-black text-slate-950">{formatPrice(service.price)}</strong><p className="mt-2 text-xs text-slate-500">Mức giá có thể thay đổi theo yêu cầu thực tế.</p><button className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700" type="button">Đặt lịch ngay</button><Link className="mt-3 block text-center text-sm font-bold text-blue-600" to="/support">Cần tư vấn trước khi đặt?</Link></aside>
			</div>
		</div>
	);
}
