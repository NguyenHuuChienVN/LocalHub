import { Router } from "express";
import {
    createBooking,
    deleteMyBooking,
    getMyBookings,
    getProviderBookings,
    reviewMyBooking,
    updateProviderBookingStatus,
} from "../controllers/bookings.controller.ts";
import { authenticate, authorize } from "../middleware/auth.middleware.ts";

const customerRouter = Router();
customerRouter.use(authenticate);
customerRouter.get("/", getMyBookings);
customerRouter.post("/", createBooking);
customerRouter.delete("/:bookingId", deleteMyBooking);
customerRouter.post("/:bookingId/review", reviewMyBooking);

const providerRouter = Router();
providerRouter.use(authenticate, authorize("provider"));
providerRouter.get("/", getProviderBookings);
providerRouter.patch("/:bookingId/status", updateProviderBookingStatus);

export { customerRouter as customerBookingRoutes, providerRouter as providerBookingRoutes };
