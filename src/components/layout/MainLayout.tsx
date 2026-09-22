import { Outlet, useLocation } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout() {
	const { pathname } = useLocation();
	const isAuthPage = pathname === "/login" || pathname === "/register";

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900">
			<Header showSecondaryNav={!isAuthPage} />
			<main className="pb-16 sm:pb-0"><Outlet /></main>
			<Footer />
		</div>
	);
}
