import { hashSync } from "bcryptjs";

const now = () => new Date().toISOString();

const initialRestaurants = [
  {
    _id: "64f100000000000000000001",
    name: "Le Coin Gourmet",
    address: "22 Rue Atlas, Casablanca",
    description: "Cuisine locale revisitee.",
    openingHours: "12:00 - 23:00",
    capacity: 70,
    cuisine: "Marocaine",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
    createdAt: now(),
    updatedAt: now()
  },
  {
    _id: "64f100000000000000000002",
    name: "Sakura House",
    address: "14 Rue Tokyo, Rabat",
    description: "Sushis, ramen et grillades japonaises.",
    openingHours: "11:30 - 22:30",
    capacity: 45,
    cuisine: "Japonaise",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200",
    createdAt: now(),
    updatedAt: now()
  },
  {
    _id: "64f100000000000000000003",
    name: "Pasta Fresca",
    address: "7 Avenue d'Italie, Marrakech",
    description: "Pates fraiches et pizzas au four a bois.",
    openingHours: "12:00 - 23:30",
    capacity: 55,
    cuisine: "Italienne",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200",
    createdAt: now(),
    updatedAt: now()
  }
];

const initialUsers = [
  {
    _id: "64f1000000000000000000a1",
    name: "Admin",
    email: "admin@menufinder.dev",
    passwordHash: hashSync("admin123", 10),
    createdAt: now(),
    updatedAt: now()
  }
];

export const mockStore = {
  restaurants: [...initialRestaurants],
  bookings: [],
  users: [...initialUsers]
};

