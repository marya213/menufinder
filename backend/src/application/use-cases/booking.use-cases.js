import mongoose from "mongoose";
import { ApiError } from "../../shared/utils/ApiError.js";
import { toBookingEntity, toBookingResponse } from "../../interface-adapters/mappers/booking.mapper.js";

const ensureObjectId = (id, label) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label}.`);
  }
};

export const buildBookingUseCases = ({ bookingRepo, restaurantRepo }) => ({
  async create(payload) {
    ensureObjectId(payload.restaurantId, "restaurantId");
    const restaurantId = new mongoose.Types.ObjectId(payload.restaurantId);
    const restaurant = await restaurantRepo.findById(restaurantId);

    if (!restaurant) {
      throw new ApiError(404, "Restaurant not found.");
    }

    const currentGuests = await bookingRepo.sumGuestsForSlot({
      restaurantId,
      date: payload.date,
      time: payload.time
    });

    if (currentGuests + payload.numberOfGuests > restaurant.capacity) {
      throw new ApiError(
        400,
        `Not enough seats for this slot. Remaining seats: ${Math.max(
          0,
          restaurant.capacity - currentGuests
        )}.`
      );
    }

    const booking = await bookingRepo.create({ ...payload, restaurantId });
    return toBookingResponse(toBookingEntity(booking));
  },

  async listByRestaurant(restaurantId, date) {
    ensureObjectId(restaurantId, "restaurantId");
    const normalizedRestaurantId = new mongoose.Types.ObjectId(restaurantId);
    const bookings = await bookingRepo.findByRestaurant({
      restaurantId: normalizedRestaurantId,
      date: date || undefined
    });
    return bookings.map((item) => toBookingResponse(toBookingEntity(item)));
  },

  async cancel(bookingId) {
    ensureObjectId(bookingId, "booking id");
    const booking = await bookingRepo.cancelById(bookingId);
    if (!booking) {
      throw new ApiError(404, "Booking not found.");
    }
    return toBookingResponse(toBookingEntity(booking));
  }
});

