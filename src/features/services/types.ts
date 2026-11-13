export type ServiceCategory = {
	icon: string;
	name: string;
};

export type ServiceReview = {
	name: string;
	rating: number;
	comment: string;
	email?: string;
	createdAt?: string;
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
	description?: string;
	images?: string[];
	reviews?: ServiceReview[];
	providerYearsActive?: number;
	providerCompletedJobs?: number;
};