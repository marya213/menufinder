import { Router } from "express";
import {
  cancelBooking,
  createBooking,
  getRestaurantBookings
} from "./booking.controller.js";
import { validateCreateBooking } from "./booking.validation.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";

const router = Router();

router.post("/", authenticate, validateCreateBooking, createBooking);
router.get("/restaurant/:restaurantId", getRestaurantBookings);
router.patch("/:id/cancel", authenticate, cancelBooking);

export default router;
