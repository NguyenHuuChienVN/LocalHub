import { Star } from "lucide-react";
import { Link } from "react-router";
import type { Service } from "../types";

type ServiceCardProps = {
	service: Service;
};

function formatPrice(price: number) {
	return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}

export default function ServiceCard({ service }: ServiceCardProps) {
	return (
		<article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
			<div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
				<img className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" src={service.image} alt={service.name} loading="lazy" />
				<span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">{service.category}</span>
			</div>
			<div className="p-4">
				<h3 className="line-clamp-1 font-bold text-slate-900">{service.name}</h3>
				<p className="mt-1 truncate text-xs text-slate-500">{service.provider}</p>
				<div className="mt-2 flex items-center gap-1 text-xs text-slate-600">
					<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
					<span className="font-semibold">{service.rating}</span><span>({service.reviewCount} đánh giá)</span>
				</div>
				<div className="mt-4 flex items-center justify-between gap-2">
					<div><span className="block text-[10px] text-slate-500">Giá từ</span><strong className="text-sm text-slate-900">{formatPrice(service.price)}</strong></div>
					<Link className="rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700" to={`/services/${service.id}`}>Xem chi tiết</Link>
				</div>
			</div>
		</article>
	);
}