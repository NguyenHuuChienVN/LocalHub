import type { ServiceReview } from "./types";

function storageKey(serviceId: string) {
	return `localhub-service-reviews:${serviceId}`;
}

export function getServiceReviews(serviceId: string): ServiceReview[] {
	try {
		const storedReviews = localStorage.getItem(storageKey(serviceId));
		const parsedReviews: unknown = storedReviews ? JSON.parse(storedReviews) : [];
		if (!Array.isArray(parsedReviews)) return [];

		return parsedReviews.filter((review): review is ServiceReview =>
			typeof review === "object"
			&& review !== null
			&& "name" in review
			&& typeof review.name === "string"
			&& "email" in review
			&& typeof review.email === "string"
			&& "rating" in review
			&& typeof review.rating === "number"
			&& "comment" in review
			&& typeof review.comment === "string",
		);
	} catch {
		return [];
	}
}

export function addServiceReview(serviceId: string, review: ServiceReview): boolean {
	const reviews = getServiceReviews(serviceId);
	if (review.email && reviews.some((item) => item.email?.toLowerCase() === review.email?.toLowerCase())) {
		return false;
	}

	localStorage.setItem(storageKey(serviceId), JSON.stringify([
		{ ...review, createdAt: new Date().toISOString() },
		...reviews,
	]));
	return true;
}
