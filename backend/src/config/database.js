import mongoose from "mongoose";

export const connectDatabase = async (mongoUri) => {
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};
