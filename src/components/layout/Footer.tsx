import { Link, useLocation } from "react-router";

const mobileNavItems = [
	{ icon: "🏠", label: "Trang chủ", href: "/" },
	{ icon: "🔍", label: "Dịch vụ", href: "/services" },
	{ icon: "🏷️", label: "Ưu đãi", href: "/offers" },
	{ icon: "💬", label: "Hỗ trợ", href: "/support" },
	{ icon: "👤", label: "Tài khoản", href: "/profile" },
];

export default function Footer() {
	const { pathname } = useLocation();

	return (
		<footer className="mt-12 border-t border-slate-200 bg-white">
			<nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-slate-200 bg-white sm:hidden">
				{mobileNavItems.map(({ icon, label, href }) => {
					const isActive = href === "/" ? pathname === href : pathname.startsWith(href);
					return <Link className={`flex flex-col items-center gap-0.5 py-2 text-[10px] ${isActive ? "font-bold text-blue-600" : "text-slate-400"}`} to={href} key={label}><span className="text-base leading-5">{icon}</span>{label}</Link>;
				})}
			</nav>
			<div className="mx-10 py-6 text-sm text-slate-500 max-sm:mx-4 max-sm:mb-16 max-sm:py-5 text-center">
				<strong className="text-slate-800">LocalHub</strong> - Kết nối bạn với dịch vụ địa phương đáng tin cậy.
			</div>
		</footer>
	);
}
