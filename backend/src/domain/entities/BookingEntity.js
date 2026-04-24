export class BookingEntity {
  constructor({
    id,
    restaurantId,
    customerName,
    customerEmail,
    date,
    time,
    numberOfGuests,
    status = "confirmed"
  }) {
    this.id = id;
    this.restaurantId = restaurantId;
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.date = date;
    this.time = time;
    this.numberOfGuests = numberOfGuests;
    this.status = status;
  }
}

