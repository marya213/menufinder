export class RestaurantEntity {
  constructor({
    id,
    name,
    address,
    description,
    openingHours,
    capacity,
    cuisine = "International",
    imageUrl = ""
  }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.description = description;
    this.openingHours = openingHours;
    this.capacity = capacity;
    this.cuisine = cuisine;
    this.imageUrl = imageUrl;
  }
}

