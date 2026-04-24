import { ApiError } from "../../shared/utils/ApiError.js";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validatePayload = (payload, requireName) => {
  const { name, email, password } = payload;

  if (requireName && (typeof name !== "string" || name.trim().length < 2)) {
    throw new ApiError(400, "name must be a non-empty string.");
  }

  if (typeof email !== "string" || !isValidEmail(email.trim())) {
    throw new ApiError(400, "email is invalid.");
  }

  if (typeof password !== "string" || password.length < 6) {
    throw new ApiError(400, "password must contain at least 6 characters.");
  }
};

export const validateRegister = (req, res, next) => {
  validatePayload(req.body, true);
  next();
};

export const validateLogin = (req, res, next) => {
  validatePayload(req.body, false);
  next();
};

