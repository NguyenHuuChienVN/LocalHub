import {
	Bell,
	ChevronRight,
	CircleHelp,
	Heart,
	Info,
	LockKeyhole,
	MapPin,
	ReceiptText,
	Ticket,
	UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { clearAuthUser, getAuthUser, type AuthUser } from "../../features/auth/authStorage";

const accountRows = [
	{ icon: ReceiptText, label: "Lịch sử đơn hàng", href: "/bookings" },
	{ icon: MapPin, label: "Địa chỉ đã lưu", href: "/profile" },
	{ icon: Heart, label: "Yêu thích", href: "/services" },
	{ icon: Ticket, label: "Ưu đãi của tôi", href: "/offers" },
];

const supportRows = [
	{ icon: Bell, label: "Thông báo", href: "/support" },
	{ icon: LockKeyhole, label: "Bảo mật", href: "/profile" },
	{ icon: CircleHelp, label: "Trung tâm hỗ trợ", href: "/support" },
];

function AccountRow({ icon: Icon, label, href }: { icon: typeof UserRound; label: string; href: string }) {
	return (
		<Link className="flex min-h-11 items-center gap-4 border-b border-slate-200 px-1 py-3 text-sm font-semibold last:border-b-0 max-sm:border-slate-700" to={href}>
			<Icon className="h-5 w-5 shrink-0 text-blue-600 max-sm:text-slate-300" />
			<span className="flex-1">{label}</span>
			<ChevronRight className="h-4 w-4 text-slate-400" />
		</Link>
	);
}

export default function ProfilePage() {
	const navigate = useNavigate();
	const [authUser, setAuthUser] = useState<AuthUser | null>(() => getAuthUser());

	useEffect(() => {
		function refreshAuthUser() {
			setAuthUser(getAuthUser());
		}

		window.addEventListener("localhub-auth-change", refreshAuthUser);
		return () => window.removeEventListener("localhub-auth-change", refreshAuthUser);
	}, []);

	function handleSignOut() {
		clearAuthUser();
		navigate("/profile", { replace: true });
	}

	if (!authUser) {
		return (
			<div className="min-h-[calc(100vh-136px)] bg-slate-50 px-4 py-12 sm:py-20">
				<section className="mx-auto max-w-md text-center">
					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><UserRound className="h-7 w-7" /></div>
					<h1 className="mt-5 text-xl font-black text-slate-950">Bạn chưa đăng nhập</h1>
					<p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-slate-500">Đăng nhập để lưu địa chỉ, theo dõi đơn hàng và nhận ưu đãi dành riêng cho bạn.</p>
					<div className="mt-6 grid gap-2 sm:grid-cols-2">
						<Link className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700" to="/login">Đăng nhập</Link>
						<Link className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50" to="/register">Đăng ký tài khoản mới</Link>
					</div>
				</section>
				<section className="mx-auto mt-8 max-w-md border-t border-slate-200 pt-2">
					<AccountRow icon={CircleHelp} label="Trung tâm hỗ trợ" href="/support" />
					<AccountRow icon={Info} label="Về LocalHub" href="/about" />
				</section>
			</div>
		);
	}

	return (
		<div className="min-h-[calc(100vh-136px)] bg-slate-50 px-4 py-5 sm:px-10 sm:py-8 max-sm:bg-[#181818] max-sm:text-white">
			<section className="mx-auto max-w-2xl">
				<div className="flex items-center gap-3">
					<div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-950 text-lg font-bold text-blue-300">{authUser.name.slice(0, 2).toUpperCase()}</div>
					<div className="min-w-0 flex-1"><h1 className="truncate text-lg font-black">{authUser.name}</h1><p className="truncate text-sm text-slate-500 max-sm:text-slate-300">{authUser.email}</p></div>
					<ChevronRight className="h-5 w-5 text-slate-400" />
				</div>
				<div className="mt-5 grid grid-cols-3 gap-2">
					{[["12", "Đơn hàng"], ["3", "Ưu đãi"], ["240", "Điểm"]].map(([value, label]) => <div className="rounded-lg bg-white px-2 py-3 text-center text-slate-900 max-sm:bg-[#111111] max-sm:text-white" key={label}><strong className="block text-lg font-black">{value}</strong><span className="text-xs text-slate-500 max-sm:text-slate-300">{label}</span></div>)}
				</div>
				<div className="mt-4 rounded-lg bg-white px-3 text-slate-900 shadow-sm max-sm:bg-[#181818] max-sm:text-white max-sm:shadow-none">
					{accountRows.map((row) => <AccountRow {...row} key={row.label} />)}
				</div>
				<div className="mt-4 rounded-lg bg-white px-3 text-slate-900 shadow-sm max-sm:bg-[#181818] max-sm:text-white max-sm:shadow-none">
					{supportRows.map((row) => <AccountRow {...row} key={row.label} />)}
				</div>
				<button className="mt-4 w-full rounded-lg border border-red-500 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 max-sm:hover:bg-red-950/30" onClick={handleSignOut} type="button">Đăng xuất</button>
			</section>
		</div>
	);
}
