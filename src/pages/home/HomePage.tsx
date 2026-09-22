import { Clock3, Headphones, ShieldCheck, Users } from "lucide-react";
import CategorySection from "./components/CategorySection";
import HeroSearch from "./components/HeroSearch";
import PopularServicesSection from "./components/PopularServicesSection";

const benefits = [
  { icon: ShieldCheck, title: "Nhà cung cấp uy tín", text: "Được xác minh trong khu vực" },
  { icon: Clock3, title: "Giá cả minh bạch", text: "Xem giá trước khi đặt" },
  { icon: Headphones, title: "Hỗ trợ tận tâm", text: "Đội ngũ hỗ trợ sẵn sàng" },
];

export default function HomePage() {
  return (
    <div className="mx-10 py-6 max-sm:mx-4 max-sm:py-4">
      <HeroSearch />
      <section className="mt-[18px] grid grid-cols-2 gap-2.5 sm:hidden">
        {[["10,000+", "Nhà cung cấp uy tín"], ["50,000+", "Đơn hàng hoàn thành"], ["98%", "Khách hàng hài lòng"], ["24/7", "Hỗ trợ tận tâm"]].map(([value, label]) => <div className="flex min-h-[73px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white" key={label}><strong className="text-lg font-black text-blue-600">{value}</strong><span className="mt-1 text-[10px] text-slate-500">{label}</span></div>)}
      </section>
        <CategorySection />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
        <PopularServicesSection />
      <aside className="mt-9 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm max-sm:mt-0">
          <h2 className="text-lg font-black">Tại sao chọn LocalHub?</h2>
          <div className="mt-5 space-y-5">{benefits.map(({ icon: Icon, title, text }) => <div className="flex gap-3" key={title}><Icon className="h-5 w-5 shrink-0 text-blue-600" /><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs text-slate-500">{text}</p></div></div>)}</div>
          <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5"><Users className="h-6 w-6 text-blue-600" /><div><strong className="block text-lg">10,000+</strong><span className="text-xs text-slate-500">nhà cung cấp tin cậy</span></div></div>
        </aside>
      </div>
    </div>
  );
}
