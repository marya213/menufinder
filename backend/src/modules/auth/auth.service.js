import { compare, hash } from "bcryptjs";
import { ApiError } from "../../shared/utils/ApiError.js";
import { authRepository } from "./auth.repository.js";
import { signAccessToken } from "./auth.token.js";

const toPublicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email
});

const buildAuthResponse = (user) => ({
  token: signAccessToken({ sub: user._id.toString(), email: user.email }),
  user: toPublicUser(user)
});

export const authService = {
  async register({ name, email, password }) {
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(409, "Email already in use.");
    }

    const passwordHash = await hash(password, 10);
    const user = await authRepository.createUser({ name, email, passwordHash });
    return buildAuthResponse(user);
  },

  async login({ email, password }) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const isValidPassword = await compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new ApiError(401, "Invalid email or password.");
    }

    return buildAuthResponse(user);
  }
};

