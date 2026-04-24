import { ApiError } from "../../shared/utils/ApiError.js";

const requiredTextFields = ["name", "address", "description", "openingHours"];

const validateRestaurantPayload = (payload, isPartial) => {
  if (!payload || typeof payload !== "object") {
    throw new ApiError(400, "Payload must be a JSON object.");
  }

  for (const field of requiredTextFields) {
    if (!isPartial || field in payload) {
      const value = payload[field];
      if (typeof value !== "string" || value.trim().length < 2) {
        throw new ApiError(400, `Field '${field}' must be a non-empty string.`);
      }
    }
  }

  if (!isPartial || "capacity" in payload) {
    if (!Number.isInteger(payload.capacity) || payload.capacity < 1) {
      throw new ApiError(400, "Field 'capacity' must be an integer >= 1.");
    }
  }

  if ("cuisine" in payload && typeof payload.cuisine !== "string") {
    throw new ApiError(400, "Field 'cuisine' must be a string.");
  }

  if ("imageUrl" in payload && typeof payload.imageUrl !== "string") {
    throw new ApiError(400, "Field 'imageUrl' must be a string.");
  }
};

export const validateCreateRestaurant = (req, res, next) => {
  validateRestaurantPayload(req.body, false);
  next();
};

export const validateUpdateRestaurant = (req, res, next) => {
  validateRestaurantPayload(req.body, true);
  next();
};
