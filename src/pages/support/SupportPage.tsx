import { CalendarCheck, ChevronDown, CreditCard, HelpCircle, Mail, MessageCircle, Phone, RotateCcw, Search, UserRound } from "lucide-react";
import { useState } from "react";

const topics = [
	{ icon: CalendarCheck, title: "Đặt lịch", description: "Đặt, đổi hoặc hủy lịch hẹn" },
	{ icon: CreditCard, title: "Thanh toán", description: "Phương thức, hóa đơn, mã ưu đãi" },
	{ icon: RotateCcw, title: "Hoàn tiền và bảo hành", description: "Khi dịch vụ chưa đạt yêu cầu" },
	{ icon: UserRound, title: "Tài khoản", description: "Đăng nhập, bảo mật, hồ sơ nhà cung cấp" },
];

const faqs = [
	{ question: "Làm sao để hủy hoặc đổi lịch hẹn?", answer: "Vào Lịch của tôi, chọn đơn và bấm Đổi lịch. Hủy trước giờ hẹn 2 tiếng sẽ không mất phí." },
	{ question: "Tôi thanh toán bằng cách nào?", answer: "Bạn có thể thanh toán trực tiếp cho nhà cung cấp hoặc chọn phương thức thanh toán được hỗ trợ ở bước đặt lịch." },
	{ question: "Nếu chưa hài lòng với dịch vụ thì sao?", answer: "Hãy liên hệ đội hỗ trợ trong vòng 24 giờ sau khi hoàn thành dịch vụ để được tiếp nhận và xử lý yêu cầu." },
];

export default function SupportPage() {
	const [query, setQuery] = useState("");
	const [openFaq, setOpenFaq] = useState(0);

	return (
		<div className="w-full bg-white px-5 py-8 sm:px-10 lg:px-16">
			<section className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center sm:px-10">
				<h1 className="text-3xl font-black text-slate-950 max-sm:text-2xl">Bạn cần giúp gì?</h1>
				<label className="mx-auto mt-5 flex max-w-xl items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm">
					<Search className="h-5 w-5 shrink-0 text-slate-400" />
					<span className="sr-only">Tìm kiếm hỗ trợ</span>
					<input className="min-w-0 flex-1 px-1 py-2 text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nhập câu hỏi, ví dụ: hủy lịch, hoàn tiền..." />
				</label>
			</section>

			<div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{topics.map(({ icon: Icon, title, description }) => <button className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md" key={title} type="button">
					<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></span>
					<strong className="mt-3 block text-sm text-slate-900">{title}</strong>
					<span className="mt-1 block text-sm leading-5 text-slate-500">{description}</span>
				</button>)}
			</div>

			<section className="mt-7">
				<h2 className="text-xl font-black text-slate-900">Câu hỏi thường gặp</h2>
				<div className="mt-3 space-y-2">
					{faqs.filter((faq) => !query.trim() || `${faq.question} ${faq.answer}`.toLowerCase().includes(query.trim().toLowerCase())).map((faq) => {
						const faqIndex = faqs.indexOf(faq);
						const isOpen = openFaq === faqIndex;
						return <div className="overflow-hidden rounded-xl border border-slate-200" key={faq.question}>
							<button className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-bold text-slate-900" onClick={() => setOpenFaq(isOpen ? -1 : faqIndex)} type="button"><span>{faq.question}</span><ChevronDown className={`h-4 w-4 shrink-0 text-blue-600 transition-transform ${isOpen ? "rotate-180" : ""}`} /></button>
							{isOpen && <p className="border-t border-slate-100 px-4 py-3 text-sm leading-6 text-slate-500">{faq.answer}</p>}
						</div>;
					})}
				</div>
			</section>

			<div className="mt-6 grid gap-3 sm:grid-cols-3">
				<a className="rounded-xl bg-blue-50 p-4 transition hover:bg-blue-100" href="tel:19000000"><strong className="flex items-center gap-2 text-sm text-blue-600"><Phone className="h-4 w-4" /> Hotline</strong><span className="mt-1 block text-sm text-slate-700">1900 0000 · 8:00–21:00</span></a>
				<a className="rounded-xl bg-blue-50 p-4 transition hover:bg-blue-100" href="#chat"><strong className="flex items-center gap-2 text-sm text-blue-600"><MessageCircle className="h-4 w-4" /> Chat Zalo</strong><span className="mt-1 block text-sm text-slate-700">Trả lời trong 5 phút</span></a>
				<a className="rounded-xl bg-blue-50 p-4 transition hover:bg-blue-100" href="mailto:hotro@localhub.vn"><strong className="flex items-center gap-2 text-sm text-blue-600"><Mail className="h-4 w-4" /> Email</strong><span className="mt-1 block text-sm text-slate-700">hotro@localhub.vn</span></a>
			</div>
		</div>
	);
}