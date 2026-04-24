import { useState } from "react";
import BookingForm from "./BookingForm.jsx";
import Button from "./ui/Button.jsx";
import "./RestaurantCard.css";

const RestaurantCard = ({ restaurant, authToken, currentUser }) => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <article className="restaurant-card">
      <img
        className="restaurant-card__image"
        src={
          restaurant.imageUrl ||
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200"
        }
        alt={restaurant.name}
      />

      <div className="restaurant-card__body">
        <h3>{restaurant.name}</h3>
        <p>{restaurant.description}</p>

        <ul>
          <li>
            <strong>Adresse:</strong> {restaurant.address}
          </li>
          <li>
            <strong>Type:</strong> {restaurant.cuisine}
          </li>
          <li>
            <strong>Horaires:</strong> {restaurant.openingHours}
          </li>
          <li>
            <strong>Capacite:</strong> {restaurant.capacity} places
          </li>
        </ul>

        <Button
          className="restaurant-card__book-btn"
          onClick={() => setShowBooking((prev) => !prev)}
        >
          {showBooking ? "Fermer" : "Reserver"}
        </Button>

        {showBooking && (
          <BookingForm
            restaurantId={restaurant._id}
            authToken={authToken}
            currentUser={currentUser}
          />
        )}
      </div>
    </article>
  );
};

export default RestaurantCard;
