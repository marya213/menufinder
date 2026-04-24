// Contract for booking persistence adapters.
// Expected methods:
// - create(payload)
// - findByRestaurant({ restaurantId, date })
// - sumGuestsForSlot({ restaurantId, date, time })
// - cancelById(id)
export const BookingRepositoryPort = {};

