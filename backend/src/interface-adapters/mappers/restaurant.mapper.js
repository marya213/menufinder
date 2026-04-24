import { RestaurantEntity } from "../../domain/entities/RestaurantEntity.js";

const resolveId = (item) => item?._id?.toString?.() || item?.id;

export const toRestaurantEntity = (item) =>
  new RestaurantEntity({
    id: resolveId(item),
    name: item.name,
    address: item.address,
    description: item.description,
    openingHours: item.openingHours,
    capacity: item.capacity,
    cuisine: item.cuisine,
    imageUrl: item.imageUrl
  });

export const toRestaurantResponse = (entity) => ({
  _id: entity.id,
  name: entity.name,
  address: entity.address,
  description: entity.description,
  openingHours: entity.openingHours,
  capacity: entity.capacity,
  cuisine: entity.cuisine,
  imageUrl: entity.imageUrl
});

