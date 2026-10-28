import { CircleUserRound, House, MessageCircle, Search, Tag } from "lucide-react";
import { Link, useLocation } from "react-router";

const mobileNavItems = [
	{ icon: House, label: "Trang chủ", href: "/" },
	{ icon: Search, label: "Dịch vụ", href: "/services" },
	{ icon: Tag, label: "Ưu đãi", href: "/offers" },
	{ icon: MessageCircle, label: "Hỗ trợ", href: "/support" },
	{ icon: CircleUserRound, label: "Tài khoản", href: "/profile" },
];

export default function Footer() {
	const { pathname } = useLocation();

	return (
		<footer className="mt-12 border-t border-slate-200 bg-white">
			<nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-slate-200 bg-white sm:hidden">
				{mobileNavItems.map(({ icon: Icon, label, href }) => {
					const isActive = href === "/" ? pathname === href : pathname.startsWith(href);
					return <Link aria-current={isActive ? "page" : undefined} className={`flex flex-col items-center gap-1 py-2 text-[10px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${isActive ? "font-bold text-blue-600" : "text-slate-400 hover:text-slate-700"}`} to={href} key={label}><Icon aria-hidden="true" className="h-5 w-5" strokeWidth={isActive ? 2.3 : 1.8} />{label}</Link>;
				})}
			</nav>
			<div className="mx-10 py-6 text-sm text-slate-500 max-sm:mx-4 max-sm:mb-16 max-sm:py-5 text-center">
				<strong className="text-slate-800">LocalHub</strong> - Kết nối bạn với dịch vụ địa phương đáng tin cậy.
			</div>
		</footer>
	);
}
