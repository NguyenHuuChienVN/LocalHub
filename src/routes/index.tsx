import { createBrowserRouter } from "react-router";
import MainLayout from "../components/layout/MainLayout";
import ComingSoonPage from "../pages/common/ComingSoonPage";
import HomePage from "../pages/home/HomePage";
import ServiceDetailPage from "../pages/services/detail/ServiceDetailPage";
import ServicesPage from "../pages/services/list/ServicesPage";

export const router = createBrowserRouter([
	{
		element: <MainLayout />,
		children: [
			{ path: "/", element: <HomePage /> },
			{ path: "/services", element: <ServicesPage /> },
			{ path: "/services/:serviceId", element: <ServiceDetailPage /> },
			{ path: "/providers", element: <ComingSoonPage /> },
			{ path: "/offers", element: <ComingSoonPage /> },
			{ path: "/blog", element: <ComingSoonPage /> },
			{ path: "/support", element: <ComingSoonPage /> },
			{ path: "/profile", element: <ComingSoonPage /> },
			{ path: "/bookings", element: <ComingSoonPage /> },
			{ path: "/login", element: <ComingSoonPage /> },
			{ path: "/register", element: <ComingSoonPage /> },
		],
	},
]);
