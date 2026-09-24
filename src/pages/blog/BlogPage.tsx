import { useMemo, useState } from "react";

const categories = ["Tất cả", "Mẹo nhà cửa", "Bảng giá", "Câu chuyện thợ"];

const articles = [
	{ title: "5 dấu hiệu điều hòa cần vệ sinh trước mùa nóng", description: "Máy chạy ồn, ra hơi yếu hay có mùi lạ đều là tín hiệu bạn không nên bỏ qua.", category: "Mẹo nhà cửa", readTime: "6 phút đọc", color: "from-blue-600 to-blue-500", featured: true },
	{ title: "Giá dọn nhà theo giờ tại Hà Nội năm 2026", description: "So sánh mức giá phổ biến để không bị báo quá cao.", category: "Bảng giá", readTime: "5 phút đọc", color: "from-teal-500 to-teal-600", featured: false },
	{ title: "Thợ điện 15 năm kinh nghiệm chia sẻ nghề", description: "Từ công trình đầu tiên đến hàng trăm khách quen.", category: "Câu chuyện thợ", readTime: "8 phút đọc", color: "from-orange-500 to-orange-600", featured: false },
	{ title: "Cách chọn nhà cung cấp uy tín qua 4 tiêu chí", description: "Hồ sơ xác minh, đánh giá thật, bảo hành và báo giá rõ.", category: "Mẹo nhà cửa", readTime: "4 phút đọc", color: "from-pink-500 to-pink-600", featured: false },
	{ title: "Lịch vệ sinh nhà cửa theo từng khu vực", description: "Gợi ý lịch dọn dẹp đơn giản để căn nhà luôn gọn gàng.", category: "Mẹo nhà cửa", readTime: "5 phút đọc", color: "from-cyan-500 to-cyan-600", featured: false },
	{ title: "7 cách tiết kiệm điện trong mùa hè", description: "Những thay đổi nhỏ giúp gia đình giảm hóa đơn mỗi tháng.", category: "Mẹo nhà cửa", readTime: "6 phút đọc", color: "from-indigo-500 to-indigo-600", featured: false },
	{ title: "Bảng giá sửa điện nước tham khảo", description: "Mức phí phổ biến cho các hạng mục sửa chữa tại nhà.", category: "Bảng giá", readTime: "4 phút đọc", color: "from-violet-500 to-violet-600", featured: false },
	{ title: "Chi phí chuyển nhà trọn gói gồm những gì?", description: "Các khoản cần biết trước khi lựa chọn dịch vụ chuyển nhà.", category: "Bảng giá", readTime: "7 phút đọc", color: "from-sky-500 to-sky-600", featured: false },
	{ title: "Khi nào nên gọi thợ sửa máy tính?", description: "Nhận biết sớm những lỗi có thể làm hỏng thiết bị của bạn.", category: "Mẹo nhà cửa", readTime: "5 phút đọc", color: "from-rose-500 to-rose-600", featured: false },
	{ title: "Một ngày của đội sửa xe tại nhà", description: "Theo chân người thợ trên những chuyến cứu hộ trong thành phố.", category: "Câu chuyện thợ", readTime: "6 phút đọc", color: "from-amber-500 to-amber-600", featured: false },
	{ title: "Từ học nghề đến mở dịch vụ riêng", description: "Câu chuyện xây dựng uy tín bằng những công việc đầu tiên.", category: "Câu chuyện thợ", readTime: "9 phút đọc", color: "from-lime-500 to-lime-600", featured: false },
	{ title: "Bí quyết chăm cây cảnh trong nhà", description: "Chọn vị trí, tưới nước và cắt tỉa để cây phát triển khỏe mạnh.", category: "Mẹo nhà cửa", readTime: "5 phút đọc", color: "from-emerald-500 to-emerald-600", featured: false },
];

export default function BlogPage() {
	const [selectedCategory, setSelectedCategory] = useState("Tất cả");
	const filteredArticles = useMemo(
		() => selectedCategory === "Tất cả" ? articles : articles.filter((article) => article.category === selectedCategory),
		[selectedCategory],
	);
	function patternStyle() {
		return { backgroundImage: "repeating-linear-gradient(135deg, transparent 0, transparent 15px, rgba(255,255,255,.24) 15px, rgba(255,255,255,.24) 17px)" };
	}

	return (
		<div className="w-full bg-white px-5 py-8 sm:px-10 lg:px-16">
			<div>
				<h1 className="text-3xl font-black text-slate-950 max-sm:text-2xl">Blog LocalHub</h1>
				<p className="mt-2 text-sm text-slate-500">Mẹo chăm sóc nhà cửa và cách chọn dịch vụ phù hợp.</p>

				<nav className="mt-6 flex flex-wrap gap-2 " aria-label="Danh mục bài viết">
					{categories.map((category) => <button className={`rounded-full border px-4 py-2 text-sm font-bold transition cursor-pointer ${selectedCategory === category ? "border-blue-500 bg-blue-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600"}`} key={category} onClick={() => setSelectedCategory(category)} type="button">{category}</button>)}
				</nav>

				{filteredArticles.length > 0 ? <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 cursor-pointer">
					{filteredArticles.map((article) => <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50" key={article.title}>
						<div className={`h-36 shrink-0 bg-gradient-to-br ${article.color} p-4`} style={patternStyle()}><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-800">{article.category}</span></div>
						<div className="flex flex-1 flex-col p-4">
							<h2 className="text-lg font-black leading-tight text-slate-900">{article.title}</h2>
							<p className="mt-2 text-sm leading-5 text-slate-500">{article.description}</p>
							<strong className="mt-auto pt-4 text-xs text-slate-800">{article.readTime}</strong>
						</div>
					</article>)}
				</div> : <p className="mt-8 text-sm text-slate-500">Chưa có bài viết trong danh mục này.</p>}
			</div>
		</div>
	);
}     