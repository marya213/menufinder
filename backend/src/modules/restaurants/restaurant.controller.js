import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { useCases } from "../../application/use-cases/index.js";

export const createRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await useCases.restaurants.create(req.body);
  res.status(201).json(restaurant);
});

export const getRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await useCases.restaurants.list(req.query);
  res.json(restaurants);
});

export const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await useCases.restaurants.getById(req.params.id);
  res.json(restaurant);
});

export const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await useCases.restaurants.update(req.params.id, req.body);
  res.json(restaurant);
});

export const deleteRestaurant = asyncHandler(async (req, res) => {
  await useCases.restaurants.remove(req.params.id);
  res.status(204).send();
});
