import mongoose from "mongoose";
import { ApiError } from "../../shared/utils/ApiError.js";
import { restaurantRepository } from "../restaurants/restaurant.repository.js";
import { bookingRepository } from "./booking.repository.js";

const ensureObjectId = (id, label) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label}.`);
  }
};

export const bookingService = {
  async createBooking(payload) {
    const restaurantId = new mongoose.Types.ObjectId(payload.restaurantId);
    const restaurant = await restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new ApiError(404, "Restaurant not found.");
    }

    const currentGuests = await bookingRepository.sumGuestsForSlot({
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

    return bookingRepository.create({ ...payload, restaurantId });
  },

  async getRestaurantBookings(restaurantId, date) {
    ensureObjectId(restaurantId, "restaurantId");
    const normalizedRestaurantId = new mongoose.Types.ObjectId(restaurantId);
    return bookingRepository.findByRestaurant({
      restaurantId: normalizedRestaurantId,
      date: date || undefined
    });
  },

  async cancelBooking(bookingId) {
    ensureObjectId(bookingId, "booking id");
    const booking = await bookingRepository.cancelById(bookingId);
    if (!booking) {
      throw new ApiError(404, "Booking not found.");
    }
    return booking;
  }
};
