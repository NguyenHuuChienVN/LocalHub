import { Search, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function HeroSearch() {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");

	function handleSearch(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const search = query.trim();
		navigate(search ? `/services?q=${encodeURIComponent(search)}` : "/services");
	}

	function searchPopularTerm(term: string) {
		setQuery(term);
		navigate(`/services?q=${encodeURIComponent(term)}`);
	}

	return (
		<section className="overflow-hidden rounded-2xl bg-blue-50 px-6 py-10 max-sm:rounded-[19px] max-sm:bg-gradient-to-br max-sm:from-blue-700 max-sm:to-blue-500 max-sm:px-[18px] max-sm:py-6 md:px-12">
			<div className="max-w-xl">
				<p className="mb-3 inline-flex rounded-full bg-blue-600/80 px-3 py-1.5 text-xs font-bold text-white max-sm:bg-blue-500"><span className="mr-1">⚡</span> Kết nối nhanh trong 5 phút</p>
				<h1 className="text-4xl font-black leading-tight text-slate-950 max-sm:text-[23px] max-sm:leading-[1.2] max-sm:text-white md:text-5xl">Dịch vụ địa phương<br className="max-sm:block" /> nhanh chóng &amp; tin cậy</h1>
				<p className="mt-4 max-w-lg text-base leading-7 text-slate-600 max-sm:mt-3 max-sm:text-[13px] max-sm:leading-5 max-sm:text-blue-50">Kết nối với các chuyên gia địa phương uy tín. Giá cả minh bạch.</p>
				<form className="mt-7 flex rounded-xl bg-white p-1.5 shadow-sm max-sm:mt-4 max-sm:rounded-[14px]" onSubmit={handleSearch}>
					<input className="min-w-0 flex-1 px-3 text-sm outline-none" placeholder="Bạn cần dịch vụ gì hôm nay?" aria-label="Tìm kiếm dịch vụ" value={query} onChange={(event) => setQuery(event.target.value)} />
					<button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white max-sm:px-3" type="submit"><Search className="h-4 w-4 sm:hidden" /> <span className="hidden sm:inline">Tìm kiếm</span><span className="sm:hidden">Tìm</span></button>
				</form>
				<div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600 max-sm:mt-3 max-sm:text-[11px] max-sm:text-white">
					<span className="hidden sm:inline font-bold">Phổ biến:</span>
					{["Sửa điện", "Vệ sinh nhà cửa", "Sửa máy lạnh", "Chuyển nhà"].map((term) => <button className="rounded-full border border-blue-200 px-2.5 py-1 max-sm:border-white/40" key={term} onClick={() => searchPopularTerm(term)} type="button">{term}</button>)}
				</div>
			</div>
			<div className="relative mt-4 hidden h-32 rounded-2xl bg-blue-100/90 max-sm:block"><span className="absolute left-2 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 shadow-lg"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9 Thợ điện</span><span className="absolute bottom-3 right-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 shadow-lg"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9 Sửa máy lạnh</span></div>
		</section>
	);
}