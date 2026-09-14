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
		<article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
			<img className="h-36 w-full object-cover" src={service.image} alt={service.name} />
			<div className="p-4">
				<h3 className="font-bold text-slate-900">{service.name}</h3>
				<p className="mt-1 text-xs text-slate-500">{service.provider}</p>
				<div className="mt-2 flex items-center gap-1 text-xs text-slate-600">
					<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
					<span>{service.rating}</span><span>({service.reviewCount})</span>
				</div>
				<div className="mt-4 flex items-center justify-between gap-2">
					<strong className="text-sm text-slate-900">{formatPrice(service.price)}</strong>
					<Link className="rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700" to={`/services/${service.id}`}>Xem chi tiết</Link>
				</div>
			</div>
		</article>
	);
}