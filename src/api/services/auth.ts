type LoginApiResponse = {
	success: boolean;
	message: string;
	data?: {
		token: string;
		user: {
			email: string;
			full_name: string;
			phone?: string | null;
		};
	};
};

type RegisterApiResponse = {
	success: boolean;
	message: string;
};

export type LoginResult = {
	email: string;
	name: string;
	token: string;
	phone?: string | null;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export async function loginWithIdentifier(identifier: string, password: string): Promise<LoginResult> {
	const response = await fetch(`${API_BASE_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ identifier, password }),
	});
	const result = await response.json().catch(() => null) as LoginApiResponse | null;

	if (!response.ok || !result?.success || !result.data?.token || !result.data.user) {
		throw new Error(result?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
	}

	return {
		email: result.data.user.email,
		name: result.data.user.full_name,
		token: result.data.token,
		phone: result.data.user.phone,
	};
}

export async function registerWithEmail(fullName: string, email: string, password: string, phone?: string): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ fullName, email, password, phone }),
	});
	const result = await response.json().catch(() => null) as RegisterApiResponse | null;

	if (!response.ok || !result?.success) {
		throw new Error(result?.message || "Đăng ký thất bại. Vui lòng thử lại.");
	}
}