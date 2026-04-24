import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { useCases } from "../../application/use-cases/index.js";

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await useCases.bookings.create(req.body);
  res.status(201).json(booking);
});

export const getRestaurantBookings = asyncHandler(async (req, res) => {
  const bookings = await useCases.bookings.listByRestaurant(
    req.params.restaurantId,
    req.query.date
  );
  res.json(bookings);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await useCases.bookings.cancel(req.params.id);
  res.json(booking);
});
