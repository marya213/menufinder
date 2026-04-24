import cors from "cors";
import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import restaurantRoutes from "./modules/restaurants/restaurant.routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";
import { notFound } from "./shared/middlewares/notFound.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API MenuFinder opérationnelle !" });
});

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
