import { Booking } from "./booking.model.js";
import { mockStore } from "../../shared/mock/mockStore.js";
import { isMockModeEnabled } from "../../shared/mock/mockMode.js";

const normalizeId = (id) => (typeof id === "string" ? id : id?.toString?.());
const createMockId = () =>
  Math.random().toString(16).slice(2).padEnd(24, "0").slice(0, 24);
const toDateValue = (value) => new Date(value).getTime();

export const bookingRepository = {
  create: (payload) => {
    if (!isMockModeEnabled()) {
      return Booking.create(payload);
    }

    const item = {
      _id: createMockId(),
      ...payload,
      restaurantId: normalizeId(payload.restaurantId),
      status: payload.status || "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockStore.bookings.unshift(item);
    return Promise.resolve(item);
  },
  findById: (id) => {
    if (!isMockModeEnabled()) {
      return Booking.findById(id);
    }
    const normalizedId = normalizeId(id);
    const booking = mockStore.bookings.find((item) => item._id === normalizedId);
    return Promise.resolve(booking || null);
  },
  findByRestaurant: ({ restaurantId, date }) => {
    if (isMockModeEnabled()) {
      const normalizedRestaurantId = normalizeId(restaurantId);
      const filtered = mockStore.bookings.filter((booking) => {
        if (normalizeId(booking.restaurantId) !== normalizedRestaurantId) {
          return false;
        }
        if (booking.status === "cancelled") {
          return false;
        }
        if (date && booking.date !== date) {
          return false;
        }
        return true;
      });

      const sorted = [...filtered].sort((a, b) => {
        const dateSort = a.date.localeCompare(b.date);
        if (dateSort !== 0) return dateSort;
        const timeSort = a.time.localeCompare(b.time);
        if (timeSort !== 0) return timeSort;
        return toDateValue(b.createdAt) - toDateValue(a.createdAt);
      });
      return Promise.resolve(sorted);
    }

    const filters = { restaurantId, status: { $ne: "cancelled" } };
    if (date) {
      filters.date = date;
    }
    return Booking.find(filters).sort({ date: 1, time: 1, createdAt: -1 });
  },
  sumGuestsForSlot: async ({ restaurantId, date, time }) => {
    if (isMockModeEnabled()) {
      const normalizedRestaurantId = normalizeId(restaurantId);
      const totalGuests = mockStore.bookings
        .filter(
          (booking) =>
            normalizeId(booking.restaurantId) === normalizedRestaurantId &&
            booking.date === date &&
            booking.time === time &&
            booking.status !== "cancelled"
        )
        .reduce((total, booking) => total + Number(booking.numberOfGuests || 0), 0);
      return totalGuests;
    }

    const result = await Booking.aggregate([
      {
        $match: {
          restaurantId,
          date,
          time,
          status: { $ne: "cancelled" }
        }
      },
      { $group: { _id: null, totalGuests: { $sum: "$numberOfGuests" } } }
    ]);
    return result[0]?.totalGuests || 0;
  },
  cancelById: (id) => {
    if (!isMockModeEnabled()) {
      return Booking.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
    }

    const normalizedId = normalizeId(id);
    const index = mockStore.bookings.findIndex(
      (booking) => booking._id === normalizedId
    );
    if (index === -1) {
      return Promise.resolve(null);
    }

    const updated = {
      ...mockStore.bookings[index],
      status: "cancelled",
      updatedAt: new Date().toISOString()
    };
    mockStore.bookings[index] = updated;
    return Promise.resolve(updated);
  }
};
