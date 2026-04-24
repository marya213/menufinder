import { useMemo, useState } from "react";
import { bookingApi } from "../services/bookingApi.js";
import Button from "./ui/Button.jsx";
import FormField from "./ui/FormField.jsx";
import Input from "./ui/Input.jsx";
import "./BookingForm.css";

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const BookingForm = ({ restaurantId, authToken, currentUser, onSuccess }) => {
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [date, setDate] = useState(getTodayDate());
  const [time, setTime] = useState("20:00");
  const [guests, setGuests] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () =>
      Boolean(authToken) &&
      name.trim() &&
      email.trim() &&
      date &&
      time &&
      Number(guests) > 0,
    [authToken, name, email, date, time, guests]
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      await bookingApi.create({
        restaurantId,
        customerName: name.trim(),
        customerEmail: email.trim(),
        date,
        time,
        numberOfGuests: Number(guests)
      }, authToken);

      setMessage("Reservation creee avec succes.");
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Erreur lors de la reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <h4>Reserver</h4>
      {!authToken && (
        <p className="booking-form__error">
          Connecte-toi ou cree un compte pour reserver.
        </p>
      )}
      <FormField label="Nom complet">
        <Input
          type="text"
          placeholder="Nom complet"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={!authToken}
        />
      </FormField>
      <FormField label="Email">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={!authToken}
        />
      </FormField>
      <div className="booking-form__row">
        <FormField label="Date">
          <Input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            disabled={!authToken}
          />
        </FormField>
        <FormField label="Heure">
          <Input
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            disabled={!authToken}
          />
        </FormField>
      </div>
      <FormField label="Nombre de personnes">
        <Input
          type="number"
          min={1}
          value={guests}
          onChange={(event) => setGuests(event.target.value)}
          disabled={!authToken}
        />
      </FormField>
      <Button type="submit" disabled={!canSubmit || submitting}>
        {submitting ? "Envoi..." : "Confirmer"}
      </Button>

      {message && <p className="booking-form__success">{message}</p>}
      {error && <p className="booking-form__error">{error}</p>}
    </form>
  );
};

export default BookingForm;
