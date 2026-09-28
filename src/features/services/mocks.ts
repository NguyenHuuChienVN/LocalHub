import type { Service, ServiceCategory } from "./types";

export const serviceCategories: ServiceCategory[] = [
	{ icon: "⚡", name: "Sửa chữa điện" },
	{ icon: "💧", name: "Sửa chữa nước" },
	{ icon: "🏠", name: "Vệ sinh nhà cửa" },
	{ icon: "❄", name: "Điện lạnh" },
	{ icon: "🚗", name: "Sửa chữa xe" },
	{ icon: "💻", name: "Sửa thiết bị điện tử" },
	{ icon: "🚚", name: "Chuyển nhà" },
	{ icon: "📦", name: "Vận chuyển hàng hóa" },
	{ icon: "🌳", name: "Chăm sóc cây cảnh" },
	{ icon: "🎨", name: "Sửa nhà" },
	{ icon: "🪑", name: "Lắp đặt nội thất" },
];

export const popularServices: Service[] = [
	{
		id: "electric", name: "Sửa điện dân dụng", provider: "Điện Nước Minh Tâm", category: "Sửa chữa điện",
		price: 150000, distance: 2.4, rating: 4.9, reviewCount: 120,
		image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80",
		description: "Kiểm tra và sửa chữa hệ thống điện dân dụng: chập cháy, mất điện cục bộ, lắp đặt ổ cắm và công tắc. Thợ khảo sát thực tế trước khi báo giá.",
		reviews: [
			{ name: "Anh Tuấn", rating: 5, comment: "Xử lý nhanh, giải thích rõ nguyên nhân chập điện." },
			{ name: "Chị Lan", rating: 4.8, comment: "Thợ đến đúng giờ, làm sạch sẽ." },
		],
		providerYearsActive: 5, providerCompletedJobs: 540,
	},
	{
		id: "aircon-cleaning", name: "Sửa & vệ sinh điều hòa", provider: "Điện Lạnh Thành Công", category: "Điện lạnh",
		price: 200000, distance: 3.1, rating: 4.9, reviewCount: 150,
		image: "https://th.bing.com/th/id/OIP.EKUfldlGEVmEIYwXO5G8oQHaD3?w=318&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
		description: "Vệ sinh dàn nóng, dàn lạnh, kiểm tra gas và sửa lỗi không lạnh, chảy nước. Có bảo hành sau khi vệ sinh.",
		reviews: [
			{ name: "Minh Quân", rating: 5, comment: "Máy lạnh sâu hơn hẳn sau khi vệ sinh." },
			{ name: "Thảo My", rating: 4.9, comment: "Thợ tư vấn thêm cách dùng tiết kiệm điện." },
		],
		providerYearsActive: 4, providerCompletedJobs: 610,
	},
	{
		id: "cleaning", name: "Vệ sinh nhà cửa", provider: "Vệ sinh Xanh", category: "Vệ sinh nhà cửa",
		price: 250000, distance: 4.8, rating: 4.8, reviewCount: 89,
		image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80",
		description: "Dọn dẹp, lau chùi toàn bộ nhà ở theo diện tích thực tế: sàn, bếp, nhà vệ sinh, cửa kính. Mang theo dụng cụ và dung dịch vệ sinh.",
		reviews: [
			{ name: "Hồng Nhung", rating: 4.9, comment: "Nhà sạch bong, nhân viên thân thiện." },
			{ name: "Đức Anh", rating: 4.7, comment: "Giá hợp lý so với chất lượng." },
		],
		providerYearsActive: 3, providerCompletedJobs: 410,
	},
	{
		id: "moving", name: "Chuyển nhà trọn gói", provider: "Chuyển Nhà An Toàn", category: "Chuyển nhà",
		price: 1200000, distance: 12.5, rating: 4.8, reviewCount: 65,
		image: "https://ductriviet.vn/thumbs/900x600x1/upload/baiviet/chuyennhatrongoitaidalat-7996.png",
		description: "Đóng gói, vận chuyển và sắp xếp đồ đạc khi chuyển nhà hoặc văn phòng. Có xe tải và nhân công theo khối lượng đồ.",
		reviews: [
			{ name: "Gia Bảo", rating: 4.8, comment: "Đóng gói cẩn thận, không vỡ đồ." },
			{ name: "Kim Ngân", rating: 4.6, comment: "Nhân viên khuân vác nhiệt tình." },
		],
		providerYearsActive: 6, providerCompletedJobs: 280,
	},
	{
		id: "plumbing", name: "Sửa chữa điện nước", provider: "Điện Nước Gia Đình", category: "Sửa chữa nước",
		price: 180000, distance: 2.8, rating: 4.8, reviewCount: 97,
		image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=700&q=80",
		description: "Sửa rò rỉ ống nước, tắc nghẽn bồn cầu/cống thoát, lắp đặt vòi và thiết bị vệ sinh. Khảo sát và báo giá trước khi sửa.",
		reviews: [
			{ name: "Văn Hùng", rating: 4.9, comment: "Xử lý tắc cống nhanh gọn, không mùi." },
			{ name: "Thu Trang", rating: 4.7, comment: "Giá đúng như báo trước, không phát sinh." },
		],
		providerYearsActive: 4, providerCompletedJobs: 350,
	},
	{
		id: "motorbike", name: "Sửa xe tại nhà", provider: "Cứu Hộ Xe 24h", category: "Sửa chữa xe",
		price: 120000, distance: 5.6, rating: 4.7, reviewCount: 74,
		image: "https://thosuaxemay.vn/wp-content/uploads/2023/10/dich-vu-sua-xe-tai-nha-co-the-tiep-nhan-van-chuyen-xe-ve-trung-tam-de-sua-voi-hu-hong-nang.webp",
		description: "Cứu hộ và sửa xe máy tại chỗ: hết xăng, xịt lốp, không nổ máy. Có mặt trong khu vực phục vụ trong vòng 30 phút.",
		reviews: [
			{ name: "Bảo Long", rating: 4.8, comment: "Gọi lúc nửa đêm vẫn có người đến." },
			{ name: "Ngọc Ánh", rating: 4.5, comment: "Sửa nhanh, giá hợp lý." },
		],
		providerYearsActive: 3, providerCompletedJobs: 190,
	},
	{
		id: "computer", name: "Sửa máy tính/laptop", provider: "Laptop Care", category: "Sửa thiết bị điện tử",
		price: 250000, distance: 6.2, rating: 4.9, reviewCount: 112,
		image: "https://th.bing.com/th/id/OIP.KWzzcVbPfq64SGkcYoQWsAHaE8?w=262&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
		description: "Sửa lỗi phần cứng và phần mềm: máy chậm, lỗi màn hình, thay ổ cứng/SSD, cài lại hệ điều hành. Kiểm tra miễn phí trước khi báo giá.",
		reviews: [
			{ name: "Quang Huy", rating: 5, comment: "Cứu được dữ liệu quan trọng, rất cảm ơn." },
			{ name: "Linh Chi", rating: 4.8, comment: "Tư vấn nâng cấp máy hợp lý, không ép giá." },
		],
		providerYearsActive: 5, providerCompletedJobs: 470,
	},
	{
		id: "tree-care", name: "Cắt tỉa cây cảnh", provider: "Cây Xanh Đô Thị", category: "Chăm sóc cây cảnh",
		price: 300000, distance: 8.4, rating: 4.8, reviewCount: 48,
		image: "https://th.bing.com/th/id/OIP.SalfctloU_Vyc8XMiXBAoAHaEM?w=296&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
		description: "Cắt tỉa, tạo dáng cây cảnh sân vườn, bón phân và xử lý sâu bệnh cơ bản. Phù hợp cho nhà phố và biệt thự.",
		reviews: [
			{ name: "Phương Thảo", rating: 4.9, comment: "Cây được tỉa gọn gàng, đẹp mắt hơn hẳn." },
			{ name: "Đình Khoa", rating: 4.6, comment: "Đúng hẹn, dọn dẹp sạch sau khi làm." },
		],
		providerYearsActive: 2, providerCompletedJobs: 130,
	},
	{
		id: "furniture", name: "Lắp đặt nội thất", provider: "Nội Thất Lắp Nhanh", category: "Lắp đặt nội thất",
		price: 450000, distance: 9.1, rating: 4.7, reviewCount: 63,
		image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80",
		description: "Lắp ráp tủ, giường, kệ và các đồ nội thất mua sẵn hoặc đặt đóng. Mang theo dụng cụ chuyên dụng, đảm bảo chắc chắn.",
		reviews: [
			{ name: "Mạnh Cường", rating: 4.7, comment: "Lắp tủ quần áo nhanh, gọn gàng." },
			{ name: "Yến Nhi", rating: 4.6, comment: "Thợ cẩn thận, không làm xước sàn." },
		],
		providerYearsActive: 3, providerCompletedJobs: 220,
	},
	{
		id: "cargo", name: "Vận chuyển hàng hóa", provider: "Giao Hàng Địa Phương", category: "Vận chuyển hàng hóa",
		price: 350000, distance: 11.3, rating: 4.8, reviewCount: 81,
		image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80",
		description: "Vận chuyển hàng hóa, kiện lớn trong nội thành, có nhân công bốc xếp. Theo dõi đơn hàng và giao đúng hẹn.",
		reviews: [
			{ name: "Trọng Nghĩa", rating: 4.9, comment: "Giao hàng đúng giờ, đóng gói chắc chắn." },
			{ name: "Bích Ngọc", rating: 4.7, comment: "Nhân viên hỗ trợ bốc dỡ nhiệt tình." },
		],
		providerYearsActive: 4, providerCompletedJobs: 390,
	},
	{
		id: "phone", name: "Sửa điện thoại", provider: "Mobile Care", category: "Sửa thiết bị điện tử",
		price: 180000, distance: 4.2, rating: 4.8, reviewCount: 105,
		image: "data:image/webp;base64,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",
		description: "Sửa các lỗi màn hình, pin, camera, loa, cổng sạc cho điện thoại. Kỹ thuật viên kiểm tra máy trước, báo giá rõ ràng trước khi sửa.",
		reviews: [
			{ name: "Minh Anh", rating: 5, comment: "Sửa nhanh, giá hợp lý, thợ tư vấn nhiệt tình." },
			{ name: "Thu Hà", rating: 4.8, comment: "Đúng hẹn, máy chạy mượt sau khi sửa." },
		],
		providerYearsActive: 3, providerCompletedJobs: 320,
	},
	{
		id: "painting", name: "Sơn sửa nhà", provider: "Nhà Đẹp Việt", category: "Sửa nhà",
		price: 850000, distance: 13.6, rating: 4.9, reviewCount: 56,
		image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=700&q=80",
		description: "Sơn lại tường trong/ngoài nhà, xử lý tường bong tróc, ẩm mốc trước khi sơn. Bao gồm che chắn đồ đạc và dọn dẹp sau thi công.",
		reviews: [
			{ name: "Việt Hoàng", rating: 5, comment: "Sơn đều màu, thi công gọn gàng." },
			{ name: "Cẩm Tú", rating: 4.8, comment: "Đội thợ chuyên nghiệp, đúng tiến độ." },
		],
		providerYearsActive: 7, providerCompletedJobs: 260,
	},
];