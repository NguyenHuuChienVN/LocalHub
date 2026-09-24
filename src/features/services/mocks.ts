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
	{ id: "electric", name: "Sửa điện dân dụng", provider: "Điện Nước Minh Tâm", category: "Sửa chữa điện", price: 150000, distance: 2.4, rating: 4.9, reviewCount: 120, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80" },
	{ id: "aircon-cleaning", name: "Sửa & vệ sinh điều hòa", provider: "Điện Lạnh Thành Công", category: "Điện lạnh", price: 200000, distance: 3.1, rating: 4.9, reviewCount: 150, image: "https://images.unsplash.com/photo-1631545806609-5f7f4f9b7d8f?auto=format&fit=crop&w=700&q=80" },
	{ id: "cleaning", name: "Vệ sinh nhà cửa", provider: "Vệ sinh Xanh", category: "Vệ sinh nhà cửa", price: 250000, distance: 4.8, rating: 4.8, reviewCount: 89, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80" },
	{ id: "moving", name: "Chuyển nhà trọn gói", provider: "Chuyển Nhà An Toàn", category: "Chuyển nhà", price: 1200000, distance: 12.5, rating: 4.8, reviewCount: 65, image: "https://ductriviet.vn/thumbs/900x600x1/upload/baiviet/chuyennhatrongoitaidalat-7996.png" },
	{ id: "plumbing", name: "Sửa chữa điện nước", provider: "Điện Nước Gia Đình", category: "Sửa chữa nước", price: 180000, distance: 2.8, rating: 4.8, reviewCount: 97, image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=700&q=80" },
	{ id: "motorbike", name: "Sửa xe tại nhà", provider: "Cứu Hộ Xe 24h", category: "Sửa chữa xe", price: 120000, distance: 5.6, rating: 4.7, reviewCount: 74, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80" },
	{ id: "computer", name: "Sửa máy tính/laptop", provider: "Laptop Care", category: "Sửa thiết bị điện tử", price: 250000, distance: 6.2, rating: 4.9, reviewCount: 112, image: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=700&q=80" },
	{ id: "tree-care", name: "Cắt tỉa cây cảnh", provider: "Cây Xanh Đô Thị", category: "Chăm sóc cây cảnh", price: 300000, distance: 8.4, rating: 4.8, reviewCount: 48, image: "https://images.unsplash.com/photo-1599685315640-2c4c7f6b2c3b?auto=format&fit=crop&w=700&q=80" },
	{ id: "furniture", name: "Lắp đặt nội thất", provider: "Nội Thất Lắp Nhanh", category: "Lắp đặt nội thất", price: 450000, distance: 9.1, rating: 4.7, reviewCount: 63, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80" },
	{ id: "cargo", name: "Vận chuyển hàng hóa", provider: "Giao Hàng Địa Phương", category: "Vận chuyển hàng hóa", price: 350000, distance: 11.3, rating: 4.8, reviewCount: 81, image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80" },
	{ id: "phone", name: "Sửa điện thoại", provider: "Mobile Care", category: "Sửa thiết bị điện tử", price: 180000, distance: 4.2, rating: 4.8, reviewCount: 105, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80" },
	{ id: "painting", name: "Sơn sửa nhà", provider: "Nhà Đẹp Việt", category: "Sửa nhà", price: 850000, distance: 13.6, rating: 4.9, reviewCount: 56, image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=700&q=80" },
];