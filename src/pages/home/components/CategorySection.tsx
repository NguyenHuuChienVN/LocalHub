import { serviceCategories } from "../../../features/services/mocks";
import { Link } from "react-router";

export default function CategorySection() {
	return (
		<section className="mt-9 max-sm:mt-6">
			<div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">Danh mục dịch vụ</h2><Link className="text-sm font-bold text-blue-600" to="/services">Xem tất cả</Link></div>
			<div className="grid grid-cols-4 gap-3 max-sm:grid-cols-2">
				{serviceCategories.map((category) => <Link className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-2 text-center text-xs font-semibold text-slate-700 hover:border-blue-300" to="/services" key={category.name}><span className="text-2xl" aria-hidden="true">{category.icon}</span>{category.name}</Link>)}
			</div>
		</section>
	);
}