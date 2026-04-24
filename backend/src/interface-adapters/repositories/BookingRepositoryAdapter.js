import { bookingRepository } from "../../modules/bookings/booking.repository.js";

export class BookingRepositoryAdapter {
  create(payload) {
    return bookingRepository.create(payload);
  }

  findByRestaurant(params) {
    return bookingRepository.findByRestaurant(params);
  }

  sumGuestsForSlot(params) {
    return bookingRepository.sumGuestsForSlot(params);
  }

  cancelById(id) {
    return bookingRepository.cancelById(id);
  }
}

