import mongoose from "mongoose";
import { ApiError } from "../../shared/utils/ApiError.js";
import { restaurantRepository } from "./restaurant.repository.js";

const ensureValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid restaurant id");
  }
};

export const restaurantService = {
  createRestaurant: (payload) => restaurantRepository.create(payload),
  async getRestaurants(queryParams) {
    const page = Math.max(1, Number.parseInt(queryParams.page || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(queryParams.limit || "6", 10))
    );
    const q = (queryParams.q || "").trim();
    const cuisine = (queryParams.cuisine || "").trim();

    const [items, total] = await restaurantRepository.findAll({
      page,
      limit,
      q,
      cuisine
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    };
  },
  async getRestaurantById(id) {
    ensureValidObjectId(id);
    const restaurant = await restaurantRepository.findById(id);
    if (!restaurant) {
      throw new ApiError(404, "Restaurant not found");
    }
    return restaurant;
  },
  async updateRestaurant(id, payload) {
    ensureValidObjectId(id);
    const updatedRestaurant = await restaurantRepository.updateById(id, payload);
    if (!updatedRestaurant) {
      throw new ApiError(404, "Restaurant not found");
    }
    return updatedRestaurant;
  },
  async deleteRestaurant(id) {
    ensureValidObjectId(id);
    const deletedRestaurant = await restaurantRepository.deleteById(id);
    if (!deletedRestaurant) {
      throw new ApiError(404, "Restaurant not found");
    }
    return deletedRestaurant;
  }
};
