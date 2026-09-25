import { CheckSquare, Clock3, Gift, Headphones, ShieldCheck, Star, Truck, Users, UsersRound } from "lucide-react";
import { Link } from "react-router";
import { virtualProviders } from "../../features/providers/mocks";
import HeroSearch from "./components/HeroSearch";
import PopularServicesSection from "./components/PopularServicesSection";

const benefits = [
  { icon: ShieldCheck, title: "Nhà cung cấp uy tín", text: "Được xác minh trong khu vực" },
  { icon: Clock3, title: "Giá cả minh bạch", text: "Xem giá trước khi đặt" },
  { icon: Headphones, title: "Hỗ trợ tận tâm", text: "Đội ngũ hỗ trợ sẵn sàng" },
];

const stats = [
  { icon: UsersRound, value: "10,000+", label: "Nhà cung cấp uy tín" },
  { icon: Truck, value: "50,000+", label: "Đơn hàng đã hoàn thành" },
  { icon: CheckSquare, value: "98%", label: "Khách hàng hài lòng" },
  { icon: Headphones, value: "24/7", label: "Hỗ trợ tận tâm" },
];

const featuredProviders = virtualProviders.slice(0, 4);

export default function HomePage() {
  return (
    <div className="mx-10 py-6 max-sm:mx-4 max-sm:py-4">
      <HeroSearch />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <PopularServicesSection />
          <section className="mt-9 grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50/90 px-3 py-3 sm:grid-cols-4 sm:gap-0 sm:px-6 sm:py-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div className="flex min-h-[73px] items-center justify-center gap-3 border-slate-200 sm:border-r last:sm:border-r-0" key={label}>
                <Icon className="h-8 w-8 shrink-0 text-blue-600 max-sm:h-6 max-sm:w-6" strokeWidth={1.8} />
                <div>
                  <strong className="block text-lg font-black leading-tight text-slate-900 max-sm:text-base">{value}</strong>
                  <span className="mt-1 block text-[11px] text-slate-500 max-sm:text-[10px]">{label}</span>
                </div>
              </div>
            ))}
          </section>
        </div>
      <aside className="mt-9 h-fit self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm max-sm:mt-0">
          <h2 className="text-lg font-black">Tại sao chọn LocalHub?</h2>
          <div className="mt-5 space-y-5">{benefits.map(({ icon: Icon, title, text }) => <div className="flex gap-3" key={title}><Icon className="h-5 w-5 shrink-0 text-blue-600" /><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs text-slate-500">{text}</p></div></div>)}</div>
          <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5"><Users className="h-6 w-6 text-blue-600" /><div><strong className="block text-lg">10,000+</strong><span className="text-xs text-slate-500">nhà cung cấp tin cậy</span></div></div>
          <section className="mt-7 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-black">Nhà cung cấp nổi bật</h2>
              <Link className="text-xs font-bold text-blue-600" to="/providers">Xem tất cả</Link>
            </div>
            <div className="mt-4 space-y-4">
              {featuredProviders.map((provider) => (
                <div className="flex items-center gap-2.5" key={provider.id}>
                  <img alt={provider.name} className="h-11 w-11 shrink-0 rounded-full object-cover" src={provider.image} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-bold text-slate-900">{provider.name}</h3>
                    <p className="mt-0.5 truncate text-[10px] text-slate-500">{provider.category}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{provider.rating} ({provider.reviewCount})</div>
                  </div>
                  <Link className="shrink-0 rounded-lg border border-blue-300 px-2.5 py-1.5 text-[10px] font-bold text-blue-700 hover:bg-blue-50" to="/providers">Xem profile</Link>
                </div>
              ))}
            </div>
          </section>
          <Link className="mt-6 flex items-center justify-between gap-3 overflow-hidden rounded-xl bg-blue-50 px-4 py-3" to="/offers">
            <div>
              <h2 className="text-sm font-black text-slate-900">Ưu đãi dành cho bạn!</h2>
              <p className="mt-1 text-[11px] text-slate-600">Giảm 20% cho đơn hàng đầu tiên</p>
              <span className="mt-2 inline-flex rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white">Nhận ưu đãi</span>
            </div>
            <Gift className="h-12 w-12 shrink-0 text-blue-500" strokeWidth={1.5} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
  