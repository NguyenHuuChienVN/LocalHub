import { Bell, ChevronDown, MapPin, Menu, Search, X } from "lucide-react";
import { useState } from "react";       
import logo from "../../assets/images/logo-nha.png";

export default function Header() {
	const [isLocationOpen, setIsLocationOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState("Hà Nội");
	const locations = [
        "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng",
        "Cần Thơ", "Nha Trang", "Huế", "Vũng Tàu", "Bình Dương"];

	function handleLocationSelect(location: string) {
		setSelectedLocation(location);
		setIsLocationOpen(false);
	}

	return (
		<header className="border-b border-slate-200 bg-white">
			<div className="mx-10 flex items-center gap-6 py-3 max-sm:mx-4 max-sm:gap-2 max-sm:py-3">
				<a className="flex min-w-fit items-center gap-2" href="/">
					<img className="h-10 w-10 rounded-[11px] object-cover" src={logo} alt="LocalHub" />
					<span>
						<strong className="block text-lg font-bold text-slate-950">LocalHub</strong>
						<small className="block text-[10px] text-slate-500">Dịch vụ địa phương</small>
					</span>
				</a>
				<div className="ml-auto flex items-center gap-2 sm:hidden">
					<button aria-expanded={isMenuOpen} aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"} className="rounded-xl bg-blue-50 p-2.5 text-blue-600" onClick={() => setIsMenuOpen((isOpen) => !isOpen)} type="button">{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
					<button aria-label="Thông báo" className="rounded-xl bg-amber-50 p-2.5 text-amber-500" type="button"><Bell className="h-5 w-5" /></button>
				</div>
				<div className="relative hidden md:block cursor-pointer">
					<button
						aria-expanded={isLocationOpen}
						aria-haspopup="listbox"
						className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
						onClick={() => setIsLocationOpen((isOpen) => !isOpen)}
						type="button"
					>
						<MapPin className="h-4 w-4 text-blue-600" /> {selectedLocation} <ChevronDown className="h-4 w-4" />
					</button>
					{isLocationOpen && (
						<div className="absolute left-0 top-8 z-10 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg" role="listbox" aria-label="Chọn địa điểm">
							{locations.map((location) => (
								<button
									aria-selected={selectedLocation === location}
									className={`block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-blue-50 cursor-pointer ${selectedLocation === location ? "font-bold text-blue-600" : "text-slate-700"}`}
									key={location}
									onClick={() => handleLocationSelect(location)}
									role="option"
									type="button"
								>
									{location}
								</button>
							))}
						</div>
					)}
				</div>
				<div className="hidden flex-1 md:flex">
					<label className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
						<Search className="h-4 w-4 text-slate-400" />
						<span className="sr-only">Tìm kiếm dịch vụ</span>
						<input className="w-full bg-transparent text-sm outline-none" placeholder="Bạn cần tìm dịch vụ gì?" />
					</label>
				</div>
				<button className="hidden rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white md:block" type="button">Tìm kiếm</button>
				<nav className="ml-auto hidden items-center gap-4 text-sm font-semibold text-slate-700 sm:flex">
					<a className="hidden lg:block" href="/provider">Trở thành nhà cung cấp</a>
					<a href="/login">Đăng nhập</a>
					<a className="rounded-lg bg-blue-600 px-4 py-2 text-white" href="/register">Đăng ký</a>
				</nav>
			</div>
			<div className="border-t border-slate-100">
				<nav className="mx-10 flex items-center gap-7 py-3 text-sm text-slate-600 max-sm:mx-4 max-sm:gap-2 max-sm:overflow-hidden max-sm:py-2">
					<a className="hidden font-semibold text-blue-700 sm:block" href="/services">Danh mục dịch vụ</a>
					<a className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white sm:border-b-2 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 sm:text-blue-700" href="/">Trang chủ</a>
					<a className="hidden sm:block" href="/services">Dịch vụ</a>
					<a className="hidden sm:block" href="/providers">Nhà cung cấp</a>
					<a className="hidden sm:block" href="/offers">Ưu đãi</a>
					<a className="hidden sm:block" href="/blog">Blog</a>
					<a className="hidden sm:block" href="/support">Hỗ trợ</a>
				</nav>
			</div>
			<div className="flex items-center gap-2 border-t border-slate-100 px-5 py-2 text-sm sm:hidden">
				<MapPin className="h-4 w-4 text-pink-500" />
				<span className="font-bold text-slate-700">{selectedLocation}</span>
				<ChevronDown className="h-3 w-3 text-slate-400" />
				<a className="ml-auto font-semibold text-blue-600" href="/login">Đăng nhập</a>
			</div>
			{isMenuOpen && (
				<nav className="border-t border-slate-100 bg-white px-5 py-2 shadow-sm sm:hidden" aria-label="Menu mobile">
					{[["Dịch vụ", "/services"], ["Nhà cung cấp", "/providers"], ["Ưu đãi", "/offers"], ["Blog", "/blog"], ["Hỗ trợ", "/support"]].map(([label, href]) => <a className="block border-b border-slate-100 py-3 text-sm font-semibold text-slate-700 last:border-0" href={href} key={label} onClick={() => setIsMenuOpen(false)}>{label}</a>)}
				</nav>
			)}
		</header>
	);
}
