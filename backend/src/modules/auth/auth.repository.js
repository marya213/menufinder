import { mockStore } from "../../shared/mock/mockStore.js";
import { isMockModeEnabled } from "../../shared/mock/mockMode.js";
import { User } from "./user.model.js";

const createMockId = () =>
  Math.random().toString(16).slice(2).padEnd(24, "0").slice(0, 24);

export const authRepository = {
  findByEmail(email) {
    if (!isMockModeEnabled()) {
      return User.findOne({ email: email.toLowerCase().trim() });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user =
      mockStore.users.find((item) => item.email.toLowerCase() === normalizedEmail) ||
      null;
    return Promise.resolve(user);
  },

  createUser({ name, email, passwordHash }) {
    if (!isMockModeEnabled()) {
      return User.create({ name, email, passwordHash });
    }

    const user = {
      _id: createMockId(),
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockStore.users.unshift(user);
    return Promise.resolve(user);
  }
};

