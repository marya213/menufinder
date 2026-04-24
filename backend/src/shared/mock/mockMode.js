import env from "../../config/env.js";

export const isMockModeEnabled = () => Boolean(env.useMocks);

