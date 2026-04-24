import { Restaurant } from "./restaurant.model.js";
import { mockStore } from "../../shared/mock/mockStore.js";
import { isMockModeEnabled } from "../../shared/mock/mockMode.js";

const normalizeId = (id) => (typeof id === "string" ? id : id?.toString?.());
const createMockId = () =>
  Math.random().toString(16).slice(2).padEnd(24, "0").slice(0, 24);
const toDateValue = (value) => new Date(value).getTime();
const contains = (value, search) =>
  String(value || "").toLowerCase().includes(search.toLowerCase());

export const restaurantRepository = {
  create: (payload) => {
    if (!isMockModeEnabled()) {
      return Restaurant.create(payload);
    }

    const item = {
      _id: createMockId(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockStore.restaurants.unshift(item);
    return Promise.resolve(item);
  },
  findAll: ({ page, limit, q, cuisine }) => {
    if (isMockModeEnabled()) {
      const filtered = mockStore.restaurants.filter((restaurant) => {
        const matchesQ =
          !q ||
          contains(restaurant.name, q) ||
          contains(restaurant.address, q) ||
          contains(restaurant.description, q);
        const matchesCuisine = !cuisine || contains(restaurant.cuisine, cuisine);
        return matchesQ && matchesCuisine;
      });

      const sorted = [...filtered].sort(
        (a, b) => toDateValue(b.createdAt) - toDateValue(a.createdAt)
      );
      const start = (page - 1) * limit;
      const items = sorted.slice(start, start + limit);
      return Promise.resolve([items, sorted.length]);
    }

    const filters = {};
    if (q) {
      filters.$or = [
        { name: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }
    if (cuisine) {
      filters.cuisine = { $regex: cuisine, $options: "i" };
    }

    return Promise.all([
      Restaurant.find(filters)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Restaurant.countDocuments(filters)
    ]);
  },
  findById: (id) => {
    if (!isMockModeEnabled()) {
      return Restaurant.findById(id);
    }
    const normalizedId = normalizeId(id);
    const restaurant =
      mockStore.restaurants.find((item) => item._id === normalizedId) || null;
    return Promise.resolve(restaurant);
  },
  updateById: (id, payload) => {
    if (!isMockModeEnabled()) {
      return Restaurant.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
      });
    }

    const normalizedId = normalizeId(id);
    const index = mockStore.restaurants.findIndex(
      (item) => item._id === normalizedId
    );
    if (index === -1) {
      return Promise.resolve(null);
    }

    const updated = {
      ...mockStore.restaurants[index],
      ...payload,
      updatedAt: new Date().toISOString()
    };
    mockStore.restaurants[index] = updated;
    return Promise.resolve(updated);
  },
  deleteById: (id) => {
    if (!isMockModeEnabled()) {
      return Restaurant.findByIdAndDelete(id);
    }

    const normalizedId = normalizeId(id);
    const index = mockStore.restaurants.findIndex(
      (item) => item._id === normalizedId
    );
    if (index === -1) {
      return Promise.resolve(null);
    }

    const [deleted] = mockStore.restaurants.splice(index, 1);
    return Promise.resolve(deleted);
  },
  replaceAll: async (restaurants) => {
    if (isMockModeEnabled()) {
      mockStore.restaurants = restaurants.map((restaurant) => ({
        _id: createMockId(),
        ...restaurant,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      return mockStore.restaurants;
    }

    await Restaurant.deleteMany({});
    return Restaurant.insertMany(restaurants);
  }
};
