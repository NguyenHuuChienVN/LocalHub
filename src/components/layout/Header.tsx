import { Bell, CalendarDays, ChevronDown, LogOut, MapPin, Search, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { clearAuthUser, getAuthUser, type AuthUser } from "../../features/auth/authStorage";
import logo from "../../assets/images/logo-nha.png";

type HeaderProps = {
	showSecondaryNav?: boolean;
};

export default function Header({ showSecondaryNav = true }: HeaderProps) {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [isLocationOpen, setIsLocationOpen] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState("Hà Nội");
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [isAccountOpen, setIsAccountOpen] = useState(false);
	const [authUser, setAuthUser] = useState<AuthUser | null>(() => getAuthUser());
	const isActive = (href: string) => href === "/" ? pathname === href : pathname.startsWith(href);
	const locations = [
        "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng",
        "Cần Thơ", "Nha Trang", "Huế", "Vũng Tàu", "Bình Dương"];

	function handleLocationSelect(location: string) {
		setSelectedLocation(location);
		setIsLocationOpen(false);
	}
	function toggleSearch() {
		setIsSearchOpen((isOpen) => !isOpen);
	}

	function handleSearch(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const search = query.trim();
		navigate(search ? `/services?q=${encodeURIComponent(search)}` : "/services");
	}

	useEffect(() => {
		function refreshAuthUser() {
			setAuthUser(getAuthUser());
		}

		window.addEventListener("localhub-auth-change", refreshAuthUser);
		return () => window.removeEventListener("localhub-auth-change", refreshAuthUser);
	}, []);

	function handleSignOut() {
		clearAuthUser();
		setAuthUser(null);
		setIsAccountOpen(false);
		navigate("/");
	}

	return (
		<header className="border-b border-slate-200 bg-white">
			<div className="mx-10 flex items-center gap-6 py-3 max-sm:mx-4 max-sm:gap-2 max-sm:py-3">
				<Link className="flex min-w-fit items-center gap-2" to="/">
					<img className="h-10 w-10 rounded-[11px] object-cover" src={logo} alt="LocalHub" />
					<span>
						<strong className="block text-lg font-bold text-slate-950">LocalHub</strong>
						<small className="block text-[10px] text-slate-500">Dịch vụ địa phương</small>
					</span>
				</Link>
				<div className="ml-auto flex items-center gap-2 sm:hidden">
					<div className="relative">
						<button aria-expanded={isNotificationsOpen} aria-label="Thông báo" className="rounded-xl bg-amber-50 p-2.5 text-amber-500" onClick={() => setIsNotificationsOpen((isOpen) => !isOpen)} type="button"><Bell className="h-5 w-5" /></button>
						{isNotificationsOpen && <div className="absolute right-0 top-12 z-30 w-64 rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-lg"><strong className="block text-sm text-slate-900">Thông báo</strong><p className="mt-2 leading-5 text-slate-500">Bạn chưa có thông báo mới.</p></div>}
					</div>
					<button aria-label="Tìm kiếm" className="rounded-xl bg-green-50 p-2.5 text-green-500" onClick={toggleSearch} type="button">
						<Search className="h-5 w-5" />
					</button>
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
				<form className="hidden flex-1 items-center md:flex" onSubmit={handleSearch}>
					<label className="flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
						<Search className="h-4 w-4 text-slate-400" />
						<span className="sr-only">Tìm kiếm dịch vụ</span>
						<input className="w-full bg-transparent text-sm outline-none" placeholder="Bạn cần tìm dịch vụ gì?" value={query} onChange={(event) => setQuery(event.target.value)} />
					</label>
					<button className="ml-2 hidden h-10 shrink-0 whitespace-nowrap rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white md:block" type="submit">Tìm kiếm</button>
				</form>
				<nav className="ml-auto hidden items-center gap-4 text-sm font-semibold text-slate-700 sm:flex">
					{authUser ? <div className="relative">
						<button aria-expanded={isAccountOpen} className="flex h-11 w-52 items-center gap-2 rounded-lg border border-slate-200 px-2.5" onClick={() => setIsAccountOpen((isOpen) => !isOpen)} type="button">
							<img className="h-8 w-8 shrink-0 rounded-full object-cover" src={logo} alt="" />
							<span className="min-w-0 flex-1 truncate text-left">{authUser.name}</span><ChevronDown className="h-4 w-4 shrink-0" />
						</button>
						{isAccountOpen && <div className="absolute right-0 top-12 z-20 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
							<Link className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm hover:bg-slate-50" to="/profile"><UserRound className="h-4 w-4 shrink-0 text-blue-600" /> Thông tin cá nhân</Link>
							<Link className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm hover:bg-slate-50" to="/bookings"><CalendarDays className="h-4 w-4 shrink-0 text-blue-600" /> Đơn đặt dịch vụ</Link>
							<button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-red-600 hover:bg-red-50" onClick={handleSignOut} type="button"><LogOut className="h-4 w-4 shrink-0" /> Đăng xuất</button>
						</div>}
					</div> : <>
						<Link className="hidden lg:block" to="/providers">Trở thành nhà cung cấp</Link>
						<Link to="/login">Đăng nhập</Link>
						<Link className="rounded-lg bg-blue-600 px-4 py-2 text-white" to="/register">Đăng ký</Link>
					</>}
				</nav>
			</div>
			<div className="relative flex items-center gap-2 border-t border-slate-100 px-5 py-2 text-sm sm:hidden">
				<button aria-expanded={isLocationOpen} aria-haspopup="listbox" className="flex items-center gap-2 font-bold text-slate-700" onClick={() => setIsLocationOpen((isOpen) => !isOpen)} type="button"><MapPin className="h-4 w-4 text-pink-500" />{selectedLocation}<ChevronDown className="h-3 w-3 text-slate-400" /></button>
				{isLocationOpen && <div className="absolute left-5 top-10 z-30 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg" role="listbox" aria-label="Chọn địa điểm">{locations.map((location) => <button aria-selected={selectedLocation === location} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${selectedLocation === location ? "font-bold text-blue-600" : "text-slate-700"}`} key={location} onClick={() => handleLocationSelect(location)} role="option" type="button">{location}</button>)}</div>}
				{authUser ? <Link className="ml-auto font-semibold text-blue-600" to="/profile">{authUser.name}</Link> : <div className="ml-auto flex items-center gap-3">
					<Link className="font-semibold text-blue-600" to="/login">Đăng nhập</Link>
					<Link className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white" to="/register">Đăng ký</Link>
				</div>}
			</div>
			{showSecondaryNav && <div className="hidden border-t border-slate-100 sm:block">
				<nav className="mx-10 flex items-center justify-center gap-7 py-3 text-sm text-slate-600 max-sm:mx-4 max-sm:gap-2 max-sm:overflow-hidden max-sm:py-2">
					<Link className={`${isActive("/") ? "bg-blue-600 font-semibold text-white sm:border-b-2 sm:border-blue-600 sm:bg-transparent sm:text-blue-700" : "text-slate-600 hover:text-blue-700"} rounded-full px-4 py-2 transition-all duration-200 ease-out sm:rounded-none sm:px-0 sm:py-0`} to="/">Trang chủ</Link>
					<Link className={`${isActive("/services") ? "font-semibold text-blue-700 sm:border-b-2 sm:border-blue-600" : "text-slate-600 hover:text-blue-700"} transition-all duration-200 ease-out sm:block`} to="/services">Dịch vụ</Link>
					<Link className={`${isActive("/providers") ? "font-semibold text-blue-700 sm:border-b-2 sm:border-blue-600" : "text-slate-600 hover:text-blue-700"} transition-all duration-200 ease-out sm:block`} to="/providers">Nhà cung cấp</Link>
					<Link className={`${isActive("/offers") ? "font-semibold text-blue-700 sm:border-b-2 sm:border-blue-600" : "text-slate-600 hover:text-blue-700"} transition-all duration-200 ease-out sm:block`} to="/offers">Ưu đãi</Link>
					<Link className={`${isActive("/blog") ? "font-semibold text-blue-700 sm:border-b-2 sm:border-blue-600" : "text-slate-600 hover:text-blue-700"} transition-all duration-200 ease-out sm:block`} to="/blog">Blog</Link>
					<Link className={`${isActive("/support") ? "font-semibold text-blue-700 sm:border-b-2 sm:border-blue-600" : "text-slate-600 hover:text-blue-700"} transition-all duration-200 ease-out sm:block`} to="/support">Hỗ trợ</Link>
				</nav>
			</div>}
			{isSearchOpen && (
				<form className="flex gap-2 border-t border-slate-100 bg-white px-5 py-3 sm:hidden" onSubmit={handleSearch}>
					<input className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none" placeholder="Bạn cần tìm dịch vụ gì?" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Tìm kiếm dịch vụ" autoFocus />
					<button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white" type="submit">Tìm</button>
				</form>
			)}
		</header>
	);
}
