import mongoose from "mongoose";
import { ApiError } from "../../shared/utils/ApiError.js";

const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isValidTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const validateCreateBooking = (req, res, next) => {
  const {
    restaurantId,
    customerName,
    customerEmail,
    date,
    time,
    numberOfGuests
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(400, "Invalid restaurantId.");
  }
  if (typeof customerName !== "string" || customerName.trim().length < 2) {
    throw new ApiError(400, "customerName must be a non-empty string.");
  }
  if (typeof customerEmail !== "string" || !isValidEmail(customerEmail.trim())) {
    throw new ApiError(400, "customerEmail is invalid.");
  }
  if (typeof date !== "string" || !isValidDate(date.trim())) {
    throw new ApiError(400, "date must match YYYY-MM-DD.");
  }
  if (typeof time !== "string" || !isValidTime(time.trim())) {
    throw new ApiError(400, "time must match HH:mm.");
  }
  if (!Number.isInteger(numberOfGuests) || numberOfGuests < 1) {
    throw new ApiError(400, "numberOfGuests must be an integer >= 1.");
  }

  next();
};
