export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type ServiceBooking = {
	id: string;
	serviceId: string;
	date: string;
	time: string;
	location: string;
	price: number;
	status: BookingStatus;
	createdAt: string;
	review?: { rating: number; comment: string };
};

function storageKey(email: string) {
	return `localhub-bookings:${email.trim().toLowerCase()}`;
}

export function getBookings(email: string): ServiceBooking[] {
	try {
		const storedBookings = localStorage.getItem(storageKey(email));
		const parsedBookings: unknown = storedBookings ? JSON.parse(storedBookings) : [];
		return Array.isArray(parsedBookings) ? parsedBookings as ServiceBooking[] : [];
	} catch {
		return [];
	}
}

export function addBooking(email: string, booking: Omit<ServiceBooking, "id" | "status" | "createdAt">) {
	const newBooking: ServiceBooking = {
		...booking,
		id: crypto.randomUUID(),
		status: "pending",
		createdAt: new Date().toISOString(),
	};
	localStorage.setItem(storageKey(email), JSON.stringify([newBooking, ...getBookings(email)]));
	return newBooking;
}

export function updateBooking(email: string, bookingId: string, changes: Partial<Pick<ServiceBooking, "status" | "review">>) {
	const updatedBookings = getBookings(email).map((booking) => booking.id === bookingId ? { ...booking, ...changes } : booking);
	localStorage.setItem(storageKey(email), JSON.stringify(updatedBookings));
	return updatedBookings;
}