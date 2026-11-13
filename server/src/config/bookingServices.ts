export type BookingService = {
	name: string;
	price: number;
};

export const bookingServices: Readonly<Record<string, BookingService>> = {
	electric: { name: "Sửa điện dân dụng", price: 150000 },
	"aircon-cleaning": { name: "Sửa & vệ sinh điều hòa", price: 200000 },
	cleaning: { name: "Vệ sinh nhà cửa", price: 250000 },
	moving: { name: "Chuyển nhà trọn gói", price: 1200000 },
	plumbing: { name: "Sửa chữa điện nước", price: 180000 },
	motorbike: { name: "Sửa xe tại nhà", price: 120000 },
	computer: { name: "Sửa máy tính/laptop", price: 250000 },
	"tree-care": { name: "Cắt tỉa cây cảnh", price: 300000 },
	furniture: { name: "Lắp đặt nội thất", price: 450000 },
	cargo: { name: "Vận chuyển hàng hóa", price: 350000 },
	phone: { name: "Sửa điện thoại", price: 180000 },
	painting: { name: "Sơn sửa nhà", price: 850000 },
};
