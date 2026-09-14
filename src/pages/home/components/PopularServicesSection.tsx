import { popularServices } from "../../../features/services/mocks";
import ServiceCard from "../../../features/services/components/ServiceCard";

export default function PopularServicesSection() {
	return (
		<section className="mt-9">
			<div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">Dịch vụ phổ biến</h2><a className="text-sm font-bold text-blue-600" href="/services">Xem tất cả</a></div>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{popularServices.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
		</section>
	);
}