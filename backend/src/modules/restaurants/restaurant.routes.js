import { Router } from "express";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurants,
  updateRestaurant
} from "./restaurant.controller.js";
import {
  validateCreateRestaurant,
  validateUpdateRestaurant
} from "./restaurant.validation.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";

const router = Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", authenticate, validateCreateRestaurant, createRestaurant);
router.put("/:id", authenticate, validateUpdateRestaurant, updateRestaurant);
router.delete("/:id", authenticate, deleteRestaurant);

export default router;
