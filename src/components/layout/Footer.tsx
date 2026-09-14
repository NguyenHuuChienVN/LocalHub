export default function Footer() {
	return (
		<footer className="mt-12 border-t border-slate-200 bg-white max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:z-20 max-sm:mt-0">
			<nav className="grid grid-cols-5 sm:hidden">
				{[["🏠", "Trang chủ", "/"], ["🔍", "Dịch vụ", "/services"], ["🏷️", "Ưu đãi", "/offers"], ["💬", "Hỗ trợ", "/support"], ["👤", "Tài khoản", "/profile"]].map(([icon, label, href], index) => <a className={`flex flex-col items-center gap-0.5 py-2 text-[10px] ${index === 0 ? "font-bold text-blue-600" : "text-slate-400"}`} href={href} key={label}><span className="text-base leading-5">{icon}</span>{label}</a>)}
			</nav>
			<div className="mx-10 py-6 text-sm text-slate-500 max-sm:mx-4">
				<strong className="text-slate-800">LocalHub</strong> - Kết nối bạn với dịch vụ địa phương đáng tin cậy.
			</div>
		</footer>
	);
}
