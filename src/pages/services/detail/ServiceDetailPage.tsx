import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, MapPin, MessageCircle, RotateCcw, ShieldCheck, Star } from "lucide-react";
import { Link, useParams } from "react-router";
import { getAuthUser } from "../../../features/auth/authStorage";
import { popularServices } from "../../../features/services/mocks";

function formatPrice(price: number) {
	return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}

export default function ServiceDetailPage() {
	const { serviceId } = useParams();
	const service = popularServices.find((item) => item.id === serviceId);
	const bookingPath = `/bookings/new?serviceId=${serviceId}`;

	if (!service) {
		return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-black">Không tìm thấy dịch vụ</h1><Link className="mt-5 inline-block font-bold text-blue-600" to="/services">Quay lại danh sách</Link></div>;
	}

	const images = service.images && service.images.length > 0 ? service.images : [service.image];
	const reviews = service.reviews ?? [];
	const description = service.description ?? `${service.name} do ${service.provider} cung cấp. Nhà cung cấp sẽ kiểm tra nhu cầu thực tế, tư vấn phương án phù hợp và báo rõ chi phí trước khi thực hiện.`;
	const providerSubtitle = service.providerYearsActive
		? `Hoạt động ${service.providerYearsActive} năm · ${service.providerCompletedJobs ?? 0} đơn`
		: "Nhà cung cấp địa phương";

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-12 lg:py-8">
			<div className="mx-auto max-w-7xl">
				<Link className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600" to="/services"><ArrowLeft className="h-4 w-4" /> Tất cả dịch vụ</Link>
				<div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-5">
					<div className="min-w-0 space-y-3">
						<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
							<div className="aspect-[16/7] bg-slate-100">
								<img className="h-full w-full object-cover" src={images[0]} alt={service.name} />
							</div>
							{images.length > 1 && (
								<div className="flex gap-2 border-t border-slate-100 p-2">
									{images.map((img, index) => (
										<div className={`h-10 w-16 shrink-0 overflow-hidden rounded-md border-2 ${index === 0 ? "border-blue-600" : "border-transparent"}`} key={img}>
											<img className="h-full w-full object-cover" src={img} alt={`${service.name} ${index + 1}`} />
										</div>
									))}
								</div>
							)}
						</section>

						<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
							<h1 className="text-lg font-black text-slate-900">Mô tả dịch vụ</h1>
							<p className="mt-2 text-sm leading-5 text-slate-600">{description}</p>
							<div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-700">
								<span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Tư vấn trước khi làm</span>
								<span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Báo giá minh bạch</span>
							</div>
						</section>

						<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
							<h2 className="text-lg font-black text-slate-900">Bảng giá tham khảo</h2>
							<div className="mt-3 divide-y divide-slate-100 text-sm">
								<div className="flex items-center justify-between gap-4 py-2 text-slate-600"><span>{service.name}</span><strong className="shrink-0 text-slate-900">{formatPrice(service.price)}</strong></div>
								<div className="flex items-center justify-between gap-4 py-2 text-slate-600"><span>Tư vấn và kiểm tra</span><strong className="shrink-0 text-slate-900">Miễn phí</strong></div>
								<div className="flex items-center justify-between gap-4 py-2 text-slate-600"><span>Vật tư phát sinh</span><strong className="shrink-0 text-slate-900">Báo giá trước</strong></div>
							</div>
							<p className="mt-2 text-xs text-slate-500">Chi phí cuối cùng được xác nhận sau khi nhà cung cấp khảo sát yêu cầu.</p>
						</section>

						{reviews.length > 0 && (
							<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<h2 className="text-lg font-black text-slate-900">Đánh giá ({service.reviewCount})</h2>
									<div className="flex items-center gap-1.5 text-sm"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><strong className="text-slate-900">{service.rating}</strong><span className="text-slate-500">/ 5</span></div>
								</div>
								<div className="mt-2 divide-y divide-slate-100">
									{reviews.map((review) => <article className="flex gap-3 py-3 last:pb-0" key={review.name}>
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{review.name.slice(0, 1)}</div>
										<div className="min-w-0"><p className="text-xs font-bold text-slate-800">{review.name} <span className="font-normal text-amber-500">★ {review.rating}</span></p><p className="mt-0.5 text-xs leading-4 text-slate-500">{review.comment}</p></div>
									</article>)}
								</div>
							</section>
						)}
					</div>

					<aside className="space-y-3 lg:sticky lg:top-5">
						<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
							<p className="text-xs font-medium text-slate-500">Giá từ</p>
							<strong className="mt-0.5 block text-xl font-black text-slate-900">{formatPrice(service.price)}</strong>
							<Link className="mt-3 flex min-h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-700" state={getAuthUser() ? undefined : { from: bookingPath }} to={getAuthUser() ? bookingPath : "/login"}>Đặt lịch ngay</Link>
							<Link className="mt-1.5 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50" to="/support"><MessageCircle className="h-4 w-4" /> Cần tư vấn trước khi đặt?</Link>
							<div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
								<p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" /> Hỗ trợ bảo hành dịch vụ</p>
								<p className="flex items-center gap-2"><Clock3 className="h-4 w-4 shrink-0 text-blue-600" /> Thời gian hoàn thành tùy yêu cầu</p>
								<p className="flex items-center gap-2"><RotateCcw className="h-4 w-4 shrink-0 text-blue-600" /> Hỗ trợ nếu dịch vụ chưa đạt yêu cầu</p>
							</div>
						</section>

						<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-700">{service.provider.slice(0, 1)}</div>
								<div className="min-w-0"><h2 className="truncate text-sm font-bold text-slate-900">{service.provider}</h2><p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" /> {providerSubtitle}</p></div>
							</div>
							<Link className="mt-3 flex min-h-9 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50" to="/providers">Xem trang nhà cung cấp</Link>
						</section>
					</aside>
				</div>
			</div>
		</div>
	);
}