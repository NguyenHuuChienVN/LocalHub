import { MapPin, Search, ShieldCheck, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { virtualProviders } from "../../features/providers/mocks";

export default function ProvidersPage() {
	const [query, setQuery] = useState("");
	const normalizedQuery = query.trim().toLowerCase();
	const providers = useMemo(
		() => virtualProviders.filter((provider) => `${provider.name} ${provider.category} ${provider.location}`.toLowerCase().includes(normalizedQuery)),
		[normalizedQuery],
	);

	return (
		<div className="mx-10 py-8 max-sm:mx-4 max-sm:py-5">
			<section className="rounded-2xl bg-blue-50 px-6 py-8 sm:px-10">
				<p className="text-sm font-bold text-blue-600">Mạng lưới LocalHub</p>
				<h1 className="mt-2 text-3xl font-black text-slate-950 max-sm:text-2xl">Tìm nhà cung cấp phù hợp</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Khám phá những đội ngũ dịch vụ địa phương uy tín, có đánh giá rõ ràng và sẵn sàng hỗ trợ bạn.</p>
				<label className="mt-6 flex max-w-2xl items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
					<Search className="ml-2 h-5 w-5 shrink-0 text-slate-400" />
					<span className="sr-only">Tìm nhà cung cấp</span>
					<input className="min-w-0 flex-1 px-2 py-2 text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, dịch vụ hoặc khu vực" />
				</label>
			</section>

			<div className="mt-8 flex items-center justify-between gap-3">
				<p className="text-sm text-slate-500"><strong className="text-slate-900">{providers.length}</strong> nhà cung cấp phù hợp</p>
				<span className="text-xs text-slate-400">Dữ liệu mẫu LocalHub</span>
			</div>

			{providers.length > 0 ? <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
				{providers.map((provider) => (
					<article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" key={provider.id}>
						<img className="h-40 w-full object-cover" src={provider.image} alt={provider.name} />
						<div className="p-4">
							<div className="flex items-start justify-between gap-2">
								<h2 className="font-bold text-slate-900">{provider.name}</h2>
								{provider.verified && <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600" aria-label="Đã xác minh" />}
							</div>
							<p className="mt-1 text-xs text-slate-500">{provider.category}</p>
							<p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-blue-600" />{provider.location}</p>
							<div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
								<span className="flex items-center gap-1 text-slate-600"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{provider.rating} ({provider.reviewCount})</span>
								<span className="text-slate-500">{provider.completedJobs} đơn</span>
							</div>
						</div>
					</article>
				))}
			</div> : <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><h2 className="font-bold text-slate-900">Chưa tìm thấy nhà cung cấp</h2><p className="mt-2 text-sm text-slate-500">Thử tìm bằng tên dịch vụ hoặc khu vực khác.</p></div>}

			<section className="mt-10 flex items-center justify-between gap-6 rounded-2xl bg-blue-500 px-7 py-7 text-white shadow-sm max-sm:flex-col max-sm:items-start">
				<div>
					<h2 className="text-2xl font-black max-sm:text-xl">Bạn có tay nghề? Nhận khách cùng LocalHub</h2>
					<p className="mt-1 text-sm text-blue-50">Tạo hồ sơ miễn phí, tự đặt giá và lịch làm việc.</p>
				</div>
				<Link className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50" to="/register">Trở thành nhà cung cấp</Link>
			</section>
		</div>
	);
}