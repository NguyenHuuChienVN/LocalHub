const AUTH_STORAGE_KEY = "localhub-auth";

export type AuthUser = {
	email: string;
	name: string;
	token?: string;
	phone?: string | null;
	avatarUrl?: string | null;
	birthDate?: string | null;
	gender?: "male" | "female" | "other" | null;
	city?: string | null;
	district?: string | null;
	address?: string | null;
	bio?: string | null;
};

export function saveAuthUser(user: AuthUser, remember = true) {
	const storage = remember ? localStorage : sessionStorage;
	const otherStorage = remember ? sessionStorage : localStorage;
	otherStorage.removeItem(AUTH_STORAGE_KEY);
	storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
	window.dispatchEvent(new Event("localhub-auth-change"));
}

export function updateAuthUser(updates: Partial<AuthUser>) {
	const currentUser = getAuthUser();
	if (!currentUser) return null;

	const updatedUser = { ...currentUser, ...updates };
	saveAuthUser(updatedUser, localStorage.getItem(AUTH_STORAGE_KEY) !== null);
	return updatedUser;
}

export function getAuthUser(): AuthUser | null {
	const storedUser = localStorage.getItem(AUTH_STORAGE_KEY) ?? sessionStorage.getItem(AUTH_STORAGE_KEY);

	if (!storedUser) {
		return null;
	}

	try {
		return JSON.parse(storedUser) as AuthUser;
	} catch {
		localStorage.removeItem(AUTH_STORAGE_KEY);
		sessionStorage.removeItem(AUTH_STORAGE_KEY);
		return null;
	}
}

export function clearAuthUser() {
	localStorage.removeItem(AUTH_STORAGE_KEY);
	sessionStorage.removeItem(AUTH_STORAGE_KEY);
	window.dispatchEvent(new Event("localhub-auth-change"));
}
