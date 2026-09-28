import { ArrowLeft, BriefcaseBusiness, CalendarDays, MapPin, ShieldCheck, Star } from "lucide-react";
import { Link, useParams } from "react-router";
import { virtualProviders } from "../../../features/providers/mocks";

export default function ProviderDetailPage() {
	const { providerId } = useParams();
	const provider = virtualProviders.find((item) => item.id === providerId);

	if (!provider) {
		return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-black text-slate-950">Không tìm thấy nhà cung cấp</h1><Link className="mt-5 inline-block font-bold text-blue-600 hover:text-blue-700" to="/providers">Quay lại danh sách</Link></div>;
	}

	return (
		<div className="min-h-[calc(100vh-136px)] bg-slate-50 px-4 py-6 sm:px-8 sm:py-8">
			<div className="mx-auto max-w-5xl">
				<Link className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600" to="/providers"><ArrowLeft className="h-4 w-4" /> Danh sách nhà cung cấp</Link>
				<section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
					<div className="grid sm:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.2fr)]">
						<img className="aspect-[16/10] h-full w-full object-cover sm:aspect-auto" src={provider.image} alt={provider.name} />
						<div className="p-5 sm:p-7">
							<div className="flex items-center gap-2 text-sm font-bold text-blue-600">{provider.verified && <><ShieldCheck className="h-4 w-4" /> Đã xác minh</>}</div>
							<h1 className="mt-2 text-2xl font-black text-slate-950">{provider.name}</h1>
							<p className="mt-1 text-sm text-slate-500">{provider.category}</p>
							<div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
								<span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-blue-600" />{provider.location}</span>
								<span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{provider.rating} ({provider.reviewCount} đánh giá)</span>
							</div>
							<div className="mt-5 flex flex-wrap gap-3">
								<div className="min-w-28 rounded-lg bg-blue-50 px-4 py-3"><strong className="block text-lg font-black text-blue-700">{provider.completedJobs}</strong><span className="text-xs text-slate-600">Đơn hoàn thành</span></div>
								<div className="min-w-28 rounded-lg bg-slate-50 px-4 py-3"><strong className="block text-lg font-black text-slate-900">{provider.reviewCount}</strong><span className="text-xs text-slate-600">Lượt đánh giá</span></div>
							</div>
						</div>
					</div>
				</section>

				<div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
					<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
						<h2 className="text-lg font-black text-slate-900">Giới thiệu</h2>
						<p className="mt-2 text-sm leading-6 text-slate-600">{provider.introduction || "Nhà cung cấp chưa cập nhật nội dung giới thiệu."}</p>
						<Link className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700" to="/services">Khám phá dịch vụ</Link>
					</section>

					<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
						<h2 className="text-lg font-black text-slate-900">Thông tin đăng ký</h2>
						<dl className="mt-3 divide-y divide-slate-100 text-sm">
							<div className="flex items-start gap-4 py-3"><dt className="flex min-w-32 items-center gap-2 text-slate-500"><MapPin className="h-4 w-4 shrink-0" /> Địa chỉ</dt><dd className="font-semibold text-slate-800">{provider.address || provider.location}</dd></div>
							<div className="flex items-start gap-4 py-3"><dt className="flex min-w-32 items-center gap-2 text-slate-500"><BriefcaseBusiness className="h-4 w-4 shrink-0" /> Mã số thuế</dt><dd className="font-semibold text-slate-800">{provider.taxCode || "Chưa cập nhật"}</dd></div>
							<div className="flex items-start gap-4 py-3"><dt className="flex min-w-32 items-center gap-2 text-slate-500"><CalendarDays className="h-4 w-4 shrink-0" /> Ngày đăng ký</dt><dd className="font-semibold text-slate-800">{provider.registeredAt || "Chưa cập nhật"}</dd></div>
						</dl>
					</section>
				</div>
			</div>
		</div>
	);
}
