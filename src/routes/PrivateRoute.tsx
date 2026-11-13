import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { getAuthUser } from "../features/auth/authStorage";

export default function PrivateRoute() {
	const location = useLocation();
	const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAuthUser()));

	useEffect(() => {
		function refreshAuthentication() {
			setIsAuthenticated(Boolean(getAuthUser()));
		}

		window.addEventListener("localhub-auth-change", refreshAuthentication);
		return () => window.removeEventListener("localhub-auth-change", refreshAuthentication);
	}, []);

	if (!isAuthenticated) {
		return <Navigate replace state={{ from: `${location.pathname}${location.search}` }} to="/login" />;
	}

	return <Outlet />;
}
