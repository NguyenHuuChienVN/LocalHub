import { createBrowserRouter } from "react-router";
import MainLayout from "../components/layout/MainLayout";
import ComingSoonPage from "../pages/common/ComingSoonPage";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/login/LoginPage";
import RegisterPage from "../pages/auth/register/RegisterPage";
import ServiceDetailPage from "../pages/services/detail/ServiceDetailPage";
import ServicesPage from "../pages/services/list/ServicesPage";
import BookingPage from "../pages/bookings/new/BookingPage";
import ProvidersPage from "../pages/providers/ProvidersPage";
import OffersPage from "../pages/offers/OffersPage";
import BlogPage from "../pages/blog/BlogPage";
import SupportPage from "../pages/support/SupportPage";

export const router = createBrowserRouter([
	{
		element: <MainLayout />,
		children: [
			{ path: "/", element: <HomePage /> },
			{ path: "/login", element: <LoginPage /> },
			{ path: "/register", element: <RegisterPage /> },
			{ path: "/services", element: <ServicesPage /> },
			{ path: "/services/:serviceId", element: <ServiceDetailPage /> },
			{ path: "/bookings/new", element: <BookingPage /> },
			{ path: "/providers", element: <ProvidersPage /> },
			{ path: "/offers", element: <OffersPage /> },
			{ path: "/blog", element: <BlogPage /> },
			{ path: "/support", element: <SupportPage /> },
			{ path: "/profile", element: <ComingSoonPage /> },
			{ path: "/bookings", element: <ComingSoonPage /> },
		],
	},
]);
