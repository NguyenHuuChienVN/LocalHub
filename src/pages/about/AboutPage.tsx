import { Handshake, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router";

const highlights = [
	{ icon: ShieldCheck, title: "Nhà cung cấp uy tín", text: "Thông tin rõ ràng và được kiểm chứng để bạn yên tâm lựa chọn." },
	{ icon: Sparkles, title: "Giá cả minh bạch", text: "Dễ dàng xem giá, đánh giá và thông tin dịch vụ trước khi đặt." },
	{ icon: Handshake, title: "Kết nối nhanh chóng", text: "Tìm đúng người cho việc bạn cần ngay tại khu vực của mình." },
	{ icon: HeartHandshake, title: "Hỗ trợ tận tâm", text: "Đội ngũ LocalHub luôn sẵn sàng đồng hành khi bạn cần." },
];

export default function AboutPage() {
	return (
		<div className="mx-auto min-h-[calc(100vh-136px)] max-w-5xl px-4 py-8 sm:px-10 sm:py-12">
			<section className="rounded-2xl bg-blue-600 px-6 py-10 text-white sm:px-12 sm:py-14">
				<p className="text-sm font-bold text-blue-100">Về LocalHub</p>
				<h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">Kết nối bạn với dịch vụ địa phương đáng tin cậy.</h1>
				<p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">LocalHub giúp bạn tìm kiếm, so sánh và đặt các dịch vụ địa phương một cách đơn giản, minh bạch và an tâm hơn.</p>
				<Link className="mt-7 inline-flex rounded-lg bg-white px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50" to="/services">Khám phá dịch vụ</Link>
			</section>
			<section className="mt-8 grid gap-4 sm:grid-cols-2">
				{highlights.map(({ icon: Icon, title, text }) => (
					<article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={title}>
						<Icon className="h-6 w-6 text-blue-600" />
						<h2 className="mt-4 text-base font-black text-slate-900">{title}</h2>
						<p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
					</article>
				))}
			</section>
		</div>
	);
}
