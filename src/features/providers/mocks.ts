export type VirtualProvider = {
	id: string;
	name: string;
	category: string;
	location: string;
	rating: number;
	reviewCount: number;
	completedJobs: number;
	image: string;
	verified: boolean;
};

export const virtualProviders: VirtualProvider[] = [
	{ id: "minh-tam", name: "Điện Nước Minh Tâm", category: "Điện nước dân dụng", location: "Ba Đình, Hà Nội", rating: 4.9, reviewCount: 120, completedJobs: 860, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80", verified: true },
	{ id: "thanh-cong", name: "Điện Lạnh Thành Công", category: "Sửa & vệ sinh điều hòa", location: "Cầu Giấy, Hà Nội", rating: 4.9, reviewCount: 150, completedJobs: 1020, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80", verified: true },
	{ id: "ve-sinh-xanh", name: "Vệ Sinh Xanh", category: "Vệ sinh nhà cửa", location: "Đống Đa, Hà Nội", rating: 4.8, reviewCount: 89, completedJobs: 640, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80", verified: true },
	{ id: "an-toan", name: "Chuyển Nhà An Toàn", category: "Chuyển nhà & vận chuyển", location: "Thanh Xuân, Hà Nội", rating: 4.8, reviewCount: 65, completedJobs: 430, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80", verified: true },
	{ id: "laptop-care", name: "Laptop Care", category: "Sửa máy tính & điện thoại", location: "Hai Bà Trưng, Hà Nội", rating: 4.9, reviewCount: 112, completedJobs: 780, image: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=700&q=80", verified: true },
	{ id: "cay-xanh", name: "Cây Xanh Đô Thị", category: "Chăm sóc cây cảnh", location: "Tây Hồ, Hà Nội", rating: 4.8, reviewCount: 48, completedJobs: 290, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=700&q=80", verified: false },
	{ id: "nha-dep-viet", name: "Nhà Đẹp Việt", category: "Sơn sửa & nội thất", location: "Hoàng Mai, Hà Nội", rating: 4.9, reviewCount: 56, completedJobs: 510, image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=700&q=80", verified: true },
	{ id: "cuu-ho-24h", name: "Cứu Hộ Xe 24h", category: "Sửa xe tại nhà", location: "Long Biên, Hà Nội", rating: 4.7, reviewCount: 74, completedJobs: 390, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80", verified: false },
];