import { restaurantRepository } from "../../modules/restaurants/restaurant.repository.js";

export class RestaurantRepositoryAdapter {
  create(payload) {
    return restaurantRepository.create(payload);
  }

  findAll(params) {
    return restaurantRepository.findAll(params);
  }

  findById(id) {
    return restaurantRepository.findById(id);
  }

  updateById(id, payload) {
    return restaurantRepository.updateById(id, payload);
  }

  deleteById(id) {
    return restaurantRepository.deleteById(id);
  }
}

