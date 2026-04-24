import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../../modules/auth/auth.token.js";

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Authorization token is missing.");
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email
    };
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token.");
  }
};

