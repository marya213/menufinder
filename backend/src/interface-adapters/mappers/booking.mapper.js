import { BookingEntity } from "../../domain/entities/BookingEntity.js";

const resolveId = (item) => item?._id?.toString?.() || item?.id;
const resolveRestaurantId = (item) =>
  item?.restaurantId?._id?.toString?.() ||
  item?.restaurantId?.toString?.() ||
  item?.restaurantId;

export const toBookingEntity = (item) =>
  new BookingEntity({
    id: resolveId(item),
    restaurantId: resolveRestaurantId(item),
    customerName: item.customerName,
    customerEmail: item.customerEmail,
    date: item.date,
    time: item.time,
    numberOfGuests: item.numberOfGuests,
    status: item.status
  });

export const toBookingResponse = (entity) => ({
  _id: entity.id,
  restaurantId: entity.restaurantId,
  customerName: entity.customerName,
  customerEmail: entity.customerEmail,
  date: entity.date,
  time: entity.time,
  numberOfGuests: entity.numberOfGuests,
  status: entity.status
});

