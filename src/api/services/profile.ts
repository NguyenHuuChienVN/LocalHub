import type { AuthUser } from "../../features/auth/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export type ProfileData = {
	name: string;
	phone: string | null;
	birthDate: string | null;
	gender: AuthUser["gender"];
	city: string | null;
	district: string | null;
	address: string | null;
	bio: string | null;
};

type ApiResponse<T> = {
	success: boolean;
	message: string;
	data?: T;
};

type ApiProfile = {
	full_name: string;
	email: string;
	phone: string | null;
	avatar_url: string | null;
	date_of_birth: string | null;
	gender: AuthUser["gender"];
	city: string | null;
	district: string | null;
	address_line: string | null;
	bio: string | null;
};

async function authenticatedRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		headers: {
			...(init?.body ? { "Content-Type": "application/json" } : {}),
			Authorization: `Bearer ${token}`,
			...init?.headers,
		},
	});
	const result = await response.json().catch(() => null) as ApiResponse<T> | null;

	if (!response.ok || !result?.success) {
		throw new Error(result?.message || "Không thể hoàn tất yêu cầu. Vui lòng thử lại.");
	}

	return result.data as T;
}

export async function updateProfile(token: string, profile: ProfileData): Promise<AuthUser> {
	const user = await authenticatedRequest<ApiProfile>("/users/me", token, {
		method: "PUT",
		body: JSON.stringify({
			fullName: profile.name,
			phone: profile.phone,
			birthDate: profile.birthDate,
			gender: profile.gender,
			city: profile.city,
			district: profile.district,
			address: profile.address,
			bio: profile.bio,
		}),
	});

	return {
		email: user.email,
		name: user.full_name,
		phone: user.phone,
		avatarUrl: user.avatar_url,
		birthDate: user.date_of_birth,
		gender: user.gender,
		city: user.city,
		district: user.district,
		address: user.address_line,
		bio: user.bio,
		token,
	};
}

export async function uploadProfileAvatar(token: string, image: string): Promise<string> {
	const result = await authenticatedRequest<{ avatarUrl: string }>("/users/me/avatar", token, {
		method: "POST",
		body: JSON.stringify({ image }),
	});
	return result.avatarUrl;
}

export async function removeProfileAvatar(token: string): Promise<void> {
	await authenticatedRequest("/users/me/avatar", token, { method: "DELETE" });
}

export async function fetchProfileAvatar(token: string): Promise<Blob> {
	const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!response.ok) {
		const result = await response.json().catch(() => null) as ApiResponse<never> | null;
		throw new Error(result?.message || "Không thể tải ảnh đại diện.");
	}

	const image = await response.blob();
	if (!image.type.startsWith("image/")) {
		throw new Error("Máy chủ trả về dữ liệu ảnh không hợp lệ.");
	}
	return image;
}

export async function changePassword(token: string, currentPassword: string, newPassword: string): Promise<void> {
	await authenticatedRequest("/users/me/password", token, {
		method: "PUT",
		body: JSON.stringify({ currentPassword, newPassword }),
	});
}

export async function deactivateAccount(token: string, currentPassword: string): Promise<void> {
	await authenticatedRequest("/users/me", token, {
		method: "DELETE",
		body: JSON.stringify({ currentPassword }),
	});
}
