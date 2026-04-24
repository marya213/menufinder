import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    address: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    openingHours: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    cuisine: { type: String, default: "International", trim: true },
    imageUrl: { type: String, default: "" }
  },
  { timestamps: true, versionKey: false }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
