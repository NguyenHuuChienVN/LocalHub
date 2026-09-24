import { BadgePercent, Check, ClipboardPaste, Copy, Info, Search, Tag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const offers = [
	{ title: "Giảm 30K", scope: "Tất cả dịch vụ", condition: "Đơn từ 200.000đ", expires: "Hết hạn 30/10", code: "LOCAL30", border: "border-l-blue-600", titleColor: "text-blue-600" },
	{ title: "Vệ sinh giảm 20%", scope: "Tổng vệ sinh, giặt sofa", condition: "Mọi giá trị đơn", expires: "Hết hạn 15/10", code: "SACHNHA20", border: "border-l-emerald-500", titleColor: "text-emerald-600" },
	{ title: "Miễn phí khảo sát", scope: "Sửa điện nước, điều hòa", condition: "Áp dụng lần đầu", expires: "Hết hạn 31/10", code: "KHAOSATO", border: "border-l-orange-500", titleColor: "text-orange-600" },
	{ title: "Giảm 50K cho bạn bè", scope: "Mời bạn đặt lịch", condition: "Cả hai cùng nhận", expires: "Không thời hạn", code: "BANBE50", border: "border-l-pink-500", titleColor: "text-pink-600" },
];

const steps = [
	{ icon: Search, title: "Chọn dịch vụ", desc: "Tìm dịch vụ và nhà cung cấp bạn cần." },
	{ icon: ClipboardPaste, title: "Dán mã", desc: "Nhập mã ưu đãi ở bước thanh toán." },
	{ icon: BadgePercent, title: "Nhận ưu đãi", desc: "Số tiền được trừ ngay vào đơn của bạn." },
];

export default function OffersPage() {
	const [copiedCode, setCopiedCode] = useState("");

	async function copyCode(code: string) {
		try {
			await navigator.clipboard.writeText(code);
		} catch {
			// Clipboard may be unavailable outside a secure browser context.
		}
		setCopiedCode(code);
		window.setTimeout(() => setCopiedCode((current) => (current === code ? "" : current)), 1800);
	}

	return (
		<div className="min-h-[calc(100vh-136px)] w-full px-10 py-8 max-sm:px-4 max-sm:py-5">
			<div className="flex items-start gap-3">
				<div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white"><Tag className="h-5 w-5" /></div>
				<div>
					<h1 className="text-3xl font-black max-sm:text-2xl">Ưu đãi cho bạn</h1>
					<p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Sao chép mã và dán khi thanh toán. Mã áp dụng tự động theo dịch vụ bạn chọn.</p>
				</div>
			</div>

			<section className="relative mt-6 overflow-hidden rounded-2xl bg-blue-600 px-8 py-8 sm:px-10">
				<div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0, transparent 15px, rgba(255,255,255,.45) 15px, rgba(255,255,255,.45) 17px)" }} />
				<div className="relative flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-start">
					<div>
						<h2 className="text-2xl font-black text-white sm:text-3xl">Giảm 30% cho lần đặt đầu tiên</h2>
						<p className="mt-2 text-sm text-blue-100">Tối đa 100.000đ, áp dụng mọi dịch vụ tại Hà Nội.</p>
					</div>
					<Link className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50" to="/services">Đặt dịch vụ ngay</Link>
				</div>
			</section>

			<div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{offers.map((offer) => {
					const isCopied = copiedCode === offer.code;
					return (
						<article className={`flex flex-col rounded-2xl border border-l-4 border-slate-200 ${offer.border} bg-white p-5 shadow-sm`} key={offer.code}>
							<h2 className={`text-xl font-black ${offer.titleColor}`}>{offer.title}</h2>
							<p className="mt-1 text-sm text-slate-600">{offer.scope}</p>
							<div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500">
								<span>{offer.condition}</span>
								<span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{offer.expires}</span>
							</div>
							<div className="mt-auto pt-4">
								<div className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2">
									<strong className="text-sm tracking-wide text-slate-900">{offer.code}</strong>
									<button
										aria-live="polite"
										className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
										onClick={() => copyCode(offer.code)}
										type="button"
									>
										{isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
										{isCopied ? "Đã sao chép" : "Sao chép"}
									</button>
								</div>
							</div>
						</article>
					);
				})}
			</div>

			<section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-sm:p-5">
				<h2 className="text-lg font-black">Cách dùng mã</h2>
				<p className="mt-1 text-sm text-slate-500">Chỉ 3 bước là bạn đã có giá tốt hơn.</p>
				<ol className="mt-5 grid gap-4 sm:grid-cols-3">
					{steps.map((step, index) => (
						<li className="relative flex items-start gap-4 rounded-xl bg-slate-50 p-4" key={step.title}>
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white"><step.icon className="h-5 w-5" /></div>
							<div>
								<p className="text-xs font-bold uppercase tracking-wide text-blue-600">Bước {index + 1}</p>
								<h3 className="mt-0.5 text-base font-bold text-slate-900">{step.title}</h3>
								<p className="mt-1 text-sm leading-6 text-slate-500">{step.desc}</p>
							</div>
						</li>
					))}
				</ol>
				<p className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800"><Info className="h-4 w-4 shrink-0" />Mỗi đơn chỉ áp dụng một mã. Ưu đãi có thể thay đổi theo từng nhà cung cấp.</p>
			</section>
		</div>
	);
}