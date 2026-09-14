import { ArrowLeft, Construction } from "lucide-react";
import { Link, useLocation } from "react-router";

const titles: Record<string, string> = { "/providers": "Nhà cung cấp", "/offers": "Ưu đãi", "/blog": "Blog", "/support": "Hỗ trợ", "/profile": "Tài khoản", "/bookings": "Lịch đặt dịch vụ", "/login": "Đăng nhập", "/register": "Đăng ký" };

export default function ComingSoonPage() {
	const { pathname } = useLocation();
	const title = titles[pathname] ?? "Trang này";
	return <div className="mx-auto max-w-xl px-4 py-20 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Construction className="h-7 w-7" /></div><h1 className="mt-5 text-2xl font-black text-slate-950">{title} đang được hoàn thiện</h1><p className="mt-2 text-sm leading-6 text-slate-500">Tính năng này sẽ sớm có mặt. Bạn có thể tiếp tục khám phá các dịch vụ đang sẵn sàng.</p><Link className="mt-6 inline-flex items-center gap-2 font-bold text-blue-600" to="/"><ArrowLeft className="h-4 w-4" /> Về trang chủ</Link></div>;
}
