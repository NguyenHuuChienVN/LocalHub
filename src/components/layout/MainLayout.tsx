import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout() {
	return (
		<div className="min-h-screen bg-slate-50 text-slate-900">
			<Header />
			<main><Outlet /></main>
			<Footer />
		</div>
	);
}
