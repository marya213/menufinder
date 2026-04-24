import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    if (!env.useMocks) {
      await connectDatabase(env.mongoUri);
    } else {
      console.warn("Running with in-memory mocks (USE_MOCKS=true).");
    }
  } catch (error) {
    console.error(
      "Database connection failed. Falling back to in-memory mocks.",
      error.message
    );
    env.useMocks = true;
  }

  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
    if (env.useMocks) {
      console.log("Mock mode enabled: data is stored in memory only.");
    }
  });
};

startServer();
