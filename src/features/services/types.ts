export type ServiceCategory = {
	icon: string;
	name: string;
};

export type Service = {
	id: string;
	name: string;
	provider: string;
	category: string;
	price: number;
	distance: number;
	rating: number;
	reviewCount: number;
	image: string;
};