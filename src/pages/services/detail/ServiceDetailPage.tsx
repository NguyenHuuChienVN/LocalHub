import { ArrowLeft, CheckCircle2, Clock3, MapPin, MessageCircle, RotateCcw, Send, ShieldCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getAuthUser } from "../../../features/auth/authStorage";
import { popularServices } from "../../../features/services/mocks";
import { addServiceReview, getServiceReviews } from "../../../features/services/serviceReviewStorage";
import type { ServiceReview } from "../../../features/services/types";

function formatPrice(price: number) {
	return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}

export default function ServiceDetailPage() {
	const { serviceId } = useParams();
	const service = popularServices.find((item) => item.id === serviceId);
	const bookingPath = `/bookings/new?serviceId=${serviceId}`;
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [communityReviews, setCommunityReviews] = useState<ServiceReview[]>([]);
	const [rating, setRating] = useState("5");
	const [comment, setComment] = useState("");
	const [reviewError, setReviewError] = useState("");
	const [reviewNotice, setReviewNotice] = useState("");

	useEffect(() => {
		setCommunityReviews(serviceId ? getServiceReviews(serviceId) : []);
		setActiveImageIndex(0);
		setReviewError("");
		setReviewNotice("");
	}, [serviceId]);

	if (!service) {
		return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-black">Không tìm thấy dịch vụ</h1><Link className="mt-5 inline-block font-bold text-blue-600" to="/services">Quay lại danh sách</Link></div>;
	}

	const images = service.images && service.images.length > 0 ? service.images : [service.image];
	const activeImage = images[activeImageIndex] ?? images[0];
	const reviews = [...communityReviews, ...(service.reviews ?? [])];
	const authUser = getAuthUser();
	const hasReviewed = communityReviews.some((review) => review.email?.toLowerCase() === authUser?.email.toLowerCase());
	const totalReviewCount = service.reviewCount + communityReviews.length;
	const averageRating = (
		(service.rating * service.reviewCount + communityReviews.reduce((total, review) => total + review.rating, 0))
		/ Math.max(totalReviewCount, 1)
	).toFixed(1);
	const description = service.description ?? `${service.name} do ${service.provider} cung cấp. Nhà cung cấp sẽ kiểm tra nhu cầu thực tế, tư vấn phương án phù hợp và báo rõ chi phí trước khi thực hiện.`;
	const providerSubtitle = service.providerYearsActive
		? `Hoạt động ${service.providerYearsActive} năm · ${service.providerCompletedJobs ?? 0} đơn`
		: "Nhà cung cấp địa phương";

	function submitReview(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setReviewError("");
		setReviewNotice("");
		if (!service) return;
		if (!authUser) {
			setReviewError("Vui lòng đăng nhập để gửi đánh giá.");
			return;
		}
		if (comment.trim().length < 3) {
			setReviewError("Bình luận cần có ít nhất 3 ký tự.");
			return;
		}

		try {
			const saved = addServiceReview(service.id, {
				name: authUser.name,
				email: authUser.email,
				rating: Number(rating),
				comment: comment.trim(),
			});
			if (!saved) {
				setReviewNotice("Bạn đã gửi đánh giá cho dịch vụ này.");
				return;
			}
			setCommunityReviews(getServiceReviews(service.id));
			setComment("");
			setRating("5");
			setReviewNotice("Cảm ơn bạn đã chia sẻ trải nghiệm!");
		} catch {
			setReviewError("Không thể lưu đánh giá lúc này. Vui lòng thử lại.");
		}
	}

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-6 pb-24 sm:px-8 lg:px-12 lg:py-8 lg:pb-8">
			<div className="mx-auto max-w-7xl">
				<Link className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600" to="/services"><ArrowLeft className="h-4 w-4" /> Tất cả dịch vụ</Link>
				<div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-5">
					<div className="min-w-0 space-y-3">
						<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
							<div className="aspect-[16/7] bg-slate-100">
								<img className="h-full w-full object-cover" src={activeImage} alt={`${service.name} - ảnh ${activeImageIndex + 1}`} />
							</div>
							{images.length > 1 && (
								<div className="flex gap-2 border-t border-slate-100 p-2">
									{images.map((img, index) => (
										<button aria-label={`Xem ảnh ${index + 1} của ${service.name}`} aria-pressed={index === activeImageIndex} className={`h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 ${index === activeImageIndex ? "border-blue-600" : "border-transparent"}`} key={img} onClick={() => setActiveImageIndex(index)} type="button">
											<img className="h-full w-full object-cover" src={img} alt={`${service.name} ${index + 1}`} />
										</button>
									))}
								</div>
							)}
						</section>

						<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
							<Link className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100" to={`/services?category=${encodeURIComponent(service.category)}`}>{service.category}</Link>
							<h1 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">{service.name}</h1>
							<div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
								<span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><strong className="text-slate-900">{averageRating}</strong><span>({totalReviewCount} đánh giá)</span></span>
								<span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-blue-600" />Cách bạn {service.distance} km</span>
							</div>
						</section>

						<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
							<h2 className="text-lg font-black text-slate-900">Về dịch vụ</h2>
							<p className="mt-2 text-sm leading-5 text-slate-600">{description}</p>
							<div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-700">
								<span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Tư vấn trước khi làm</span>
								<span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Báo giá minh bạch</span>
							</div>
						</section>

						<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
							<h2 className="text-lg font-black text-slate-900">Bảng giá tham khảo</h2>
							<div className="mt-3 divide-y divide-slate-100 text-sm">
								<div className="flex items-center justify-between gap-4 py-2 text-slate-600"><span>{service.name}</span><strong className="shrink-0 text-slate-900">{formatPrice(service.price)}</strong></div>
								<div className="flex items-center justify-between gap-4 py-2 text-slate-600"><span>Tư vấn và kiểm tra</span><strong className="shrink-0 text-slate-900">Miễn phí</strong></div>
								<div className="flex items-center justify-between gap-4 py-2 text-slate-600"><span>Vật tư phát sinh</span><strong className="shrink-0 text-slate-900">Báo giá trước</strong></div>
							</div>
							<p className="mt-2 text-xs text-slate-500">Chi phí cuối cùng được xác nhận sau khi nhà cung cấp khảo sát yêu cầu.</p>
						</section>

						<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<h2 className="text-lg font-black text-slate-900">Đánh giá và bình luận ({totalReviewCount})</h2>
								<div className="flex items-center gap-1.5 text-sm"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><strong className="text-slate-900">{averageRating}</strong><span className="text-slate-500">/ 5</span></div>
							</div>
							{authUser ? hasReviewed ? (
								<p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Bạn đã gửi đánh giá cho dịch vụ này.</p>
							) : (
								<form className="mt-4 border-t border-slate-100 pt-4" onSubmit={submitReview}>
									<h3 className="text-sm font-bold text-slate-900">Chia sẻ trải nghiệm của bạn</h3>
									<p className="mt-3 text-sm text-slate-600">Bạn đánh giá dịch vụ này như thế nào?</p>
									<div aria-label="Chọn số sao đánh giá" className="mt-2 flex items-center gap-1.5">
										{[1, 2, 3, 4, 5].map((value) => (
											<button
												aria-label={`${value} sao`}
												aria-pressed={Number(rating) === value}
												className="rounded-sm text-amber-500 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
												key={value}
												onClick={() => setRating(String(value))}
												type="button"
											>
												<Star className={`h-6 w-6 ${value <= Number(rating) ? "fill-amber-400 text-amber-500" : "text-slate-300"}`} />
											</button>
										))}
										<strong className="ml-1 text-sm text-slate-800">{rating}/5 sao</strong>
									</div>
									<label className="sr-only" htmlFor="review-comment">Bình luận</label>
									<textarea className="mt-3 min-h-[106px] w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="review-comment" maxLength={1000} minLength={3} onChange={(event) => setComment(event.target.value)} placeholder="Hãy chia sẻ chất lượng dịch vụ, thái độ phục vụ..." required value={comment} />
									<div className="mt-2 flex flex-wrap items-center justify-between gap-3">
										<span className="text-xs text-slate-500">{comment.length}/1000 ký tự</span>
										<button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" type="submit"><Send className="h-4 w-4" /> Gửi đánh giá</button>
									</div>
								</form>
							) : (
								<p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">Đăng nhập để đánh giá và bình luận về dịch vụ này. <Link className="font-bold underline" state={{ from: `/services/${service.id}` }} to="/login">Đăng nhập</Link></p>
							)}
							{reviewError && <p className="mt-3 text-sm text-red-700" role="alert">{reviewError}</p>}
							{reviewNotice && <p className="mt-3 text-sm text-emerald-700" role="status">{reviewNotice}</p>}
							<div className="mt-3 divide-y divide-slate-100">
								{reviews.map((review, index) => <article className="flex gap-3 py-3 last:pb-0" key={`${review.email ?? "sample"}-${review.createdAt ?? review.name}-${index}`}>
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{review.name.slice(0, 1)}</div>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-bold text-slate-800">{review.name}<span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-amber-600"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{review.rating}</span></p>
										<p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-slate-600">{review.comment}</p>
										{review.createdAt && <p className="mt-1 text-xs text-slate-400">{new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(review.createdAt))}</p>}
									</div>
								</article>)}
								{reviews.length === 0 && <p className="py-5 text-center text-sm text-slate-500">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ trải nghiệm!</p>}
							</div>
						</section>

					</div>

					<aside className="space-y-3 lg:sticky lg:top-5">
						<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
							<p className="text-xs font-medium text-slate-500">Giá từ</p>
							<strong className="mt-0.5 block text-xl font-black text-slate-900">{formatPrice(service.price)}</strong>
							<Link className="mt-3 hidden min-h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-700 lg:flex" state={getAuthUser() ? undefined : { from: bookingPath }} to={getAuthUser() ? bookingPath : "/login"}>Đặt lịch ngay</Link>
							<Link className="mt-1.5 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50" to="/support"><MessageCircle className="h-4 w-4" /> Cần tư vấn trước khi đặt?</Link>
							<div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
								<p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" /> Hỗ trợ bảo hành dịch vụ</p>
								<p className="flex items-center gap-2"><Clock3 className="h-4 w-4 shrink-0 text-blue-600" /> Thời gian hoàn thành tùy yêu cầu</p>
								<p className="flex items-center gap-2"><RotateCcw className="h-4 w-4 shrink-0 text-blue-600" /> Hỗ trợ nếu dịch vụ chưa đạt yêu cầu</p>
							</div>
						</section>

						<section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-700">{service.provider.slice(0, 1)}</div>
								<div className="min-w-0"><h2 className="truncate text-sm font-bold text-slate-900">{service.provider}</h2><p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" /> {providerSubtitle}</p></div>
							</div>
							<Link className="mt-3 flex min-h-9 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50" to="/providers">Xem trang nhà cung cấp</Link>
						</section>
					</aside>
				</div>
			</div>
			<div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
					<div className="min-w-0"><span className="block text-[11px] text-slate-500">Giá từ</span><strong className="block truncate text-base font-black text-slate-900">{formatPrice(service.price)}</strong></div>
					<Link className="flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700" state={getAuthUser() ? undefined : { from: bookingPath }} to={getAuthUser() ? bookingPath : "/login"}>Đặt lịch ngay</Link>
				</div>
			</div>
		</div>
	);
}