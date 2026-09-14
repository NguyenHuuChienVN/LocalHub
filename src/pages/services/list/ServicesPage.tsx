import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import ServiceCard from "../../../features/services/components/ServiceCard";
import { popularServices, serviceCategories } from "../../../features/services/mocks";

const priceOptions = [
	{ label: "Tất cả mức giá", value: "all" },
	{ label: "Dưới 300.000đ", value: "under-300" },
	{ label: "Từ 300.000đ", value: "over-300" },
];

export default function ServicesPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("q") ?? "");
	const [category, setCategory] = useState(searchParams.get("category") ?? "all");
	const [price, setPrice] = useState("all");
	const [sort, setSort] = useState("popular");

	const filteredServices = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		const result = popularServices.filter((service) => {
			const matchesQuery = !normalizedQuery || `${service.name} ${service.provider} ${service.category}`.toLowerCase().includes(normalizedQuery);
			const matchesCategory = category === "all" || service.category.includes(category);
			const matchesPrice = price === "all" || (price === "under-300" ? service.price < 300000 : service.price >= 300000);
			return matchesQuery && matchesCategory && matchesPrice;
		});

		return [...result].sort((first, second) => sort === "price" ? first.price - second.price : second.rating - first.rating);
	}, [category, price, query, sort]);

	function applySearch(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const nextParams = new URLSearchParams();
		if (query.trim()) nextParams.set("q", query.trim());
		if (category !== "all") nextParams.set("category", category);
		setSearchParams(nextParams);
	}

	return (
		<div className="mx-10 py-8 max-sm:mx-4 max-sm:py-5">
			<div className="max-w-2xl">
				<p className="text-sm font-bold text-blue-600">Khám phá dịch vụ</p>
				<h1 className="mt-2 text-3xl font-black text-slate-950 max-sm:text-2xl">Tìm đúng người cho việc bạn cần</h1>
				<p className="mt-2 text-sm leading-6 text-slate-500">So sánh dịch vụ địa phương uy tín, rõ giá và đặt lịch nhanh chóng.</p>
			</div>

			<form className="mt-6 flex max-w-3xl gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm" onSubmit={applySearch}>
				<Search className="ml-2 mt-2.5 h-5 w-5 shrink-0 text-slate-400" />
				<input className="min-w-0 flex-1 px-2 py-2 text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm dịch vụ hoặc nhà cung cấp" aria-label="Tìm dịch vụ hoặc nhà cung cấp" />
				<button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700" type="submit">Tìm kiếm</button>
			</form>

			<div className="mt-8 grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
				<aside className="rounded-xl border border-slate-200 bg-white p-4">
					<div className="flex items-center gap-2 font-bold"><Filter className="h-4 w-4 text-blue-600" /> Bộ lọc</div>
					<label className="mt-5 block text-xs font-bold text-slate-600" htmlFor="category">Danh mục</label>
					<select id="category" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
						<option value="all">Tất cả danh mục</option>
						{serviceCategories.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
					</select>
					<label className="mt-4 block text-xs font-bold text-slate-600" htmlFor="price">Mức giá</label>
					<select id="price" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" value={price} onChange={(event) => setPrice(event.target.value)}>
						{priceOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
					</select>
				</aside>

				<section>
					<div className="mb-4 flex items-center justify-between gap-3">
						<p className="text-sm text-slate-500"><strong className="text-slate-900">{filteredServices.length}</strong> dịch vụ phù hợp</p>
						<label className="flex items-center gap-2 text-sm text-slate-600"><SlidersHorizontal className="h-4 w-4" /><span className="sr-only">Sắp xếp</span><select className="rounded-lg border border-slate-200 bg-white px-3 py-2" value={sort} onChange={(event) => setSort(event.target.value)}><option value="popular">Đánh giá cao</option><option value="price">Giá thấp trước</option></select></label>
					</div>
					{filteredServices.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filteredServices.map((service) => <ServiceCard key={service.id} service={service} />)}</div> : <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><h2 className="font-bold text-slate-900">Chưa tìm thấy dịch vụ</h2><p className="mt-2 text-sm text-slate-500">Thử đổi từ khóa hoặc bộ lọc để xem thêm kết quả.</p></div>}
				</section>
			</div>
		</div>
	);
}
