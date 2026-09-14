import type { Service, ServiceCategory } from "./types";

export const serviceCategories: ServiceCategory[] = [
	{ icon: "⚡", name: "Sửa chữa điện" },
	{ icon: "💧", name: "Sửa chữa nước" },
	{ icon: "🏠", name: "Vệ sinh nhà cửa" },
	{ icon: "❄", name: "Sửa máy lạnh" },
	{ icon: "▣", name: "Sửa thiết bị điện" },
	{ icon: "🚚", name: "Chuyển nhà" },
	{ icon: "▰", name: "Sơn sửa nhà" },
	{ icon: "▰", name: "Lắp đặt nội thất" },
];

export const popularServices: Service[] = [
	{ id: "electric", name: "Sửa điện dân dụng", provider: "Điện Nước Minh Tâm", category: "Điện, Nước, Sửa chữa", price: 150000, rating: 4.9, reviewCount: 120, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80" },
	{ id: "cleaning", name: "Vệ sinh nhà cửa", provider: "Vệ sinh Xanh", category: "Vệ sinh nhà cửa", price: 250000, rating: 4.8, reviewCount: 89, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80" },
	{ id: "aircon", name: "Sửa máy lạnh", provider: "Sửa Chữa 24h", category: "Điện lạnh", price: 200000, rating: 4.9, reviewCount: 150, image: "https://images.unsplash.com/photo-1631545806609-7a4e5e2a45a6?auto=format&fit=crop&w=700&q=80" },
	{ id: "moving", name: "Chuyển nhà trọn gói", provider: "Chuyển Nhà An Toàn", category: "Chuyển nhà", price: 1200000, rating: 4.8, reviewCount: 65, image: "https://images.unsplash.com/photo-1600510348055-7c2e0a98e9f4?auto=format&fit=crop&w=700&q=80" },
];