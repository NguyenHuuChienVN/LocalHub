import type { Service, ServiceCategory } from "./types";

export const serviceCategories: ServiceCategory[] = [
	{ icon: "⚡", name: "Sửa chữa điện" },
	{ icon: "💧", name: "Sửa chữa nước" },
	{ icon: "🏠", name: "Vệ sinh nhà cửa" },
	{ icon: "❄", name: "Sửa máy lạnh" },
	{ icon: "▣", name: "Sửa thiết bị điện" },
	{ icon: "🚚", name: "Chuyển nhà" },
	{ icon: "🎨", name: "Sửa nhà" },
	{ icon: "🪑", name: "Lắp đặt nội thất" },
];

export const popularServices: Service[] = [
	{ id: "electric", name: "Sửa điện dân dụng", provider: "Điện Nước Minh Tâm", category: "Sửa chữa điện", price: 150000, distance: 2.4, rating: 4.9, reviewCount: 120, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80" },
	{ id: "cleaning", name: "Vệ sinh nhà cửa", provider: "Vệ sinh Xanh", category: "Vệ sinh nhà cửa", price: 250000, distance: 4.8, rating: 4.8, reviewCount: 89, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80" },
	{ id: "aircon", name: "Sửa điều hòa", provider: "Sửa Chữa 24h", category: "Điện lạnh", price: 200000, distance: 7.2, rating: 4.9, reviewCount: 150, image: "https://th.bing.com/th/id/OIP.VIQQNVg4cHSc_VrO7nPGbwHaEH?w=309&h=180&c=7&r=0&o=7&pid=1.7&rm=3" },
	{ id: "moving", name: "Chuyển nhà trọn gói", provider: "Chuyển Nhà An Toàn", category: "Chuyển nhà", price: 1200000, distance: 12.5, rating: 4.8, reviewCount: 65, image: "https://ductriviet.vn/thumbs/900x600x1/upload/baiviet/chuyennhatrongoitaidalat-7996.png" },
];