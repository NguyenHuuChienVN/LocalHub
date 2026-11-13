import { Grid2X2 } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { serviceCategories } from "../../../features/services/mocks";

export default function CategorySection() {
	const [searchParams] = useSearchParams();
	const selectedCategory = searchParams.get("category") ?? "all";
	const categories = [
		{ icon: <Grid2X2 className="h-5 w-5" />, name: "Tất cả", href: "/services", selected: selectedCategory === "all" },
		...serviceCategories.map(({ icon, name }) => ({
			icon: <span aria-hidden="true" className="text-lg leading-none">{icon}</span>,
			name,
			href: `/services?category=${encodeURIComponent(name)}`,
			selected: selectedCategory === name,
		})),
	];

	return (
		<section aria-label="Danh mục dịch vụ" className="mt-9 max-sm:mt-6">
			<div className="mb-3 flex items-center justify-between gap-3">
				<div>
					<h2 className="text-base font-bold text-slate-900">Khám phá theo danh mục</h2>
					<p className="mt-0.5 text-xs text-slate-500">Chọn nhóm dịch vụ bạn cần</p>
				</div>
				<span className="shrink-0 text-xs text-slate-500">{serviceCategories.length} danh mục</span>
			</div>
			<div className="flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{categories.map(({ icon, name, href, selected }) => (
					<Link
						aria-current={selected ? "page" : undefined}
						className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-xs font-semibold shadow-sm transition ${selected ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}
						to={href}
						key={name}
					>
						<span className="shrink-0">{icon}</span>
						<span className="whitespace-nowrap">{name}</span>
					</Link>
				))}
			</div>
		</section>
	);
}