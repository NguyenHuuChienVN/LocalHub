import { Navigate, Outlet, useLocation } from "react-router";
import { getAuthUser } from "../features/auth/authStorage";

export default function PrivateRoute() {
	const location = useLocation();

	if (!getAuthUser()) {
		return <Navigate replace state={{ from: `${location.pathname}${location.search}` }} to="/login" />;
	}

	return <Outlet />;
}
