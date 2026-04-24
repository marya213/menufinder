import dotenv from "dotenv";

dotenv.config();

// Build mongo URI from either MONGO_URI or from separate credentials for Atlas
const buildMongoUri = () => {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;

  // If user provided separate Atlas credentials, construct the SRV connection string
  const user = process.env.MONGO_USER;
  const pass = process.env.MONGO_PASS;
  const host = process.env.MONGO_HOST || process.env.MONGO_HOSTNAME || "cluster0.mongodb.net";
  const db = process.env.MONGO_DB || "menufinder";

  if (user && pass) {
    // encode credentials in case they contain special characters
    const u = encodeURIComponent(user);
    const p = encodeURIComponent(pass);
    return `mongodb+srv://${u}:${p}@${host}/${db}?retryWrites=true&w=majority`;
  }

  // Fallback to local MongoDB
  return "mongodb://127.0.0.1:27017/menufinder";
};

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5001,
  mongoUri: buildMongoUri(),
  useMocks: process.env.USE_MOCKS === "true",
  jwtSecret: process.env.JWT_SECRET || "change-this-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d"
};

export default env;
