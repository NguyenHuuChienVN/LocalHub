const AUTH_STORAGE_KEY = "localhub-auth";
const REGISTERED_ACCOUNT_KEY = "localhub-registered-account";

export type AuthUser = {
	email: string;
	name: string;
};

export type RegisteredAccount = AuthUser & {
	password: string;
};

export function saveAuthUser(user: AuthUser) {
	localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
	window.dispatchEvent(new Event("localhub-auth-change"));
}

export function getAuthUser(): AuthUser | null {
	const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

	if (!storedUser) {
		return null;
	}

	try {
		return JSON.parse(storedUser) as AuthUser;
	} catch {
		localStorage.removeItem(AUTH_STORAGE_KEY);
		return null;
	}
}

export function clearAuthUser() {
	localStorage.removeItem(AUTH_STORAGE_KEY);
	window.dispatchEvent(new Event("localhub-auth-change"));
}

export function saveRegisteredAccount(account: RegisteredAccount) {
	localStorage.setItem(REGISTERED_ACCOUNT_KEY, JSON.stringify(account));
}

export function getRegisteredAccount(): RegisteredAccount | null {
	const storedAccount = localStorage.getItem(REGISTERED_ACCOUNT_KEY);

	if (!storedAccount) {
		return null;
	}

	try {
		return JSON.parse(storedAccount) as RegisteredAccount;
	} catch {
		localStorage.removeItem(REGISTERED_ACCOUNT_KEY);
		return null;
	}
}