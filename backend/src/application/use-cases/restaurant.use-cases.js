import mongoose from "mongoose";
import { ApiError } from "../../shared/utils/ApiError.js";
import {
  toRestaurantEntity,
  toRestaurantResponse
} from "../../interface-adapters/mappers/restaurant.mapper.js";

const ensureRestaurantId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid restaurant id");
  }
};

export const buildRestaurantUseCases = ({ restaurantRepo }) => ({
  async create(payload) {
    const created = await restaurantRepo.create(payload);
    return toRestaurantResponse(toRestaurantEntity(created));
  },

  async list(queryParams) {
    const page = Math.max(1, Number.parseInt(queryParams.page || "1", 10));
    const limit = Math.min(50, Math.max(1, Number.parseInt(queryParams.limit || "6", 10)));
    const q = (queryParams.q || "").trim();
    const cuisine = (queryParams.cuisine || "").trim();

    const [items, total] = await restaurantRepo.findAll({ page, limit, q, cuisine });
    return {
      items: items.map((item) => toRestaurantResponse(toRestaurantEntity(item))),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    };
  },

  async getById(id) {
    ensureRestaurantId(id);
    const restaurant = await restaurantRepo.findById(id);
    if (!restaurant) {
      throw new ApiError(404, "Restaurant not found");
    }
    return toRestaurantResponse(toRestaurantEntity(restaurant));
  },

  async update(id, payload) {
    ensureRestaurantId(id);
    const updated = await restaurantRepo.updateById(id, payload);
    if (!updated) {
      throw new ApiError(404, "Restaurant not found");
    }
    return toRestaurantResponse(toRestaurantEntity(updated));
  },

  async remove(id) {
    ensureRestaurantId(id);
    const deleted = await restaurantRepo.deleteById(id);
    if (!deleted) {
      throw new ApiError(404, "Restaurant not found");
    }
    return true;
  }
});

