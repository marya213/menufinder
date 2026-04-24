import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    customerName: { type: String, required: true, trim: true, minlength: 2 },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed"
    }
  },
  { timestamps: true, versionKey: false }
);

export const Booking = mongoose.model("Booking", bookingSchema);
