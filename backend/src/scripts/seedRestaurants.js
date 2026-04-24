import { connectDatabase } from "../config/database.js";
import env from "../config/env.js";
import { restaurantRepository } from "../modules/restaurants/restaurant.repository.js";

const demoRestaurants = [
  {
    name: "Le Jardin Gourmand",
    address: "12 Rue des Oliviers, Casablanca",
    description: "Cuisine marocaine et mediterraneenne avec terrasse.",
    openingHours: "12:00 - 23:00",
    capacity: 80,
    cuisine: "Marocaine",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"
  },
  {
    name: "Pasta Bella",
    address: "4 Boulevard Zerktouni, Casablanca",
    description: "Restaurant italien specialise en pates fraiches.",
    openingHours: "11:30 - 22:30",
    capacity: 60,
    cuisine: "Italienne",
    imageUrl:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200"
  },
  {
    name: "Sushi Wave",
    address: "45 Avenue Hassan II, Rabat",
    description: "Experience japonaise moderne et sushi premium.",
    openingHours: "13:00 - 23:30",
    capacity: 45,
    cuisine: "Japonaise",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200"
  }
];

const seed = async () => {
  try {
    await connectDatabase(env.mongoUri);
    const inserted = await restaurantRepository.replaceAll(demoRestaurants);
    console.log(`${inserted.length} restaurants seeded successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();
