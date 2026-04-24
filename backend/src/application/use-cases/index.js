import { buildBookingUseCases } from "./booking.use-cases.js";
import { buildRestaurantUseCases } from "./restaurant.use-cases.js";
import { BookingRepositoryAdapter } from "../../interface-adapters/repositories/BookingRepositoryAdapter.js";
import { RestaurantRepositoryAdapter } from "../../interface-adapters/repositories/RestaurantRepositoryAdapter.js";

const restaurantRepo = new RestaurantRepositoryAdapter();
const bookingRepo = new BookingRepositoryAdapter();

export const useCases = {
  restaurants: buildRestaurantUseCases({ restaurantRepo }),
  bookings: buildBookingUseCases({ bookingRepo, restaurantRepo })
};

