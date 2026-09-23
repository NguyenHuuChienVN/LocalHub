import { Flower2, Grid2X2, Heart, House, MoreHorizontal, Scissors, SprayCan, Truck, Wrench } from "lucide-react";
import { Link } from "react-router";

const categoryLinks = [
	{ label: "Tất cả", icon: Grid2X2, href: "/services" },
	{ label: "Sửa chữa – Bảo trì", icon: Wrench, href: "/services?category=Sửa chữa điện" },
	{ label: "Vệ sinh – Dọn dẹp", icon: SprayCan, href: "/services?category=Vệ sinh nhà cửa" },
	{ label: "Xây dựng – Cải tạo", icon: House, href: "/services?category=Sửa nhà" },
	{ label: "Vận chuyển", icon: Truck, href: "/services?category=Chuyển nhà" },
	{ label: "Thợ thủ công", icon: Scissors, href: "/services?category=Lắp đặt nội thất" },
	{ label: "Gia đình", icon: Heart, href: "/services?category=Vệ sinh nhà cửa" },
	{ label: "Làm đẹp", icon: Flower2, href: "/services" },
	{ label: "Khác", icon: MoreHorizontal, href: "/services" },
];

export default function CategorySection() {
	return (
		<section className="mt-9 max-sm:mt-6">
			<div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{categoryLinks.map(({ label, icon: Icon, href }, index) => (
					<Link
						className={`flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-xs font-semibold shadow-sm transition ${index === 0 ? "bg-blue-600 text-white" : "border border-slate-100 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600"}`}
						to={href}
						key={label}
					>
						<Icon className="h-4 w-4" />
						{label}
					</Link>
				))}
			</div>
		</section>
	);
}