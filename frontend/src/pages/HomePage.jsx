import { useEffect, useState } from "react";
import RestaurantCard from "../components/RestaurantCard.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { authApi } from "../services/authApi.js";
import { restaurantApi } from "../services/restaurantApi.js";
import "./HomePage.css";

const AUTH_STORAGE_KEY = "menufinder_auth";

const loadStoredAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { token: "", user: null };
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token || "",
      user: parsed?.user || null
    };
  } catch {
    return { token: "", user: null };
  }
};

const HomePage = () => {
  const [authMode, setAuthMode] = useState("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [{ token, user }, setAuthState] = useState(loadStoredAuth);
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1
  });
  const [q, setQ] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await restaurantApi.getAll({
          page,
          limit: 6,
          q,
          cuisine
        });
        setRestaurants(data.items);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message || "Erreur inattendue.");
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [page, q, cuisine]);

  const onSubmitFilters = (event) => {
    event.preventDefault();
    setPage(1);
    setQ(event.target.search.value.trim());
    setCuisine(event.target.cuisine.value.trim());
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const response =
        authMode === "register"
          ? await authApi.register({
              name: authName.trim(),
              email: authEmail.trim(),
              password: authPassword
            })
          : await authApi.login({
              email: authEmail.trim(),
              password: authPassword
            });

      const nextState = { token: response.token, user: response.user };
      setAuthState(nextState);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
      setAuthPassword("");
      if (authMode === "register" && response.user?.name) {
        setAuthName(response.user.name);
      }
    } catch (err) {
      setAuthError(err.message || "Erreur d'authentification.");
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setAuthState({ token: "", user: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthPassword("");
  };

  return (
    <main className="home-page">
      <header>
        <h1>MenuFinder</h1>
        <p>Decouvre les meilleurs restaurants en quelques clics.</p>
        <div className="home-page__auth">
          {token && user ? (
            <>
              <p>
                Connecte en tant que <strong>{user.name}</strong> ({user.email})
              </p>
              <Button type="button" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <form className="home-page__auth-form" onSubmit={handleAuthSubmit}>
              <div className="home-page__auth-switch">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setAuthMode("login")}
                  disabled={authMode === "login"}
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setAuthMode("register")}
                  disabled={authMode === "register"}
                >
                  Register
                </Button>
              </div>
              {authMode === "register" && (
                <Input
                  type="text"
                  placeholder="Nom complet"
                  value={authName}
                  onChange={(event) => setAuthName(event.target.value)}
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
              />
              <Button type="submit" disabled={authLoading}>
                {authLoading
                  ? "En cours..."
                  : authMode === "register"
                    ? "Creer un compte"
                    : "Se connecter"}
              </Button>
              {authError && <p className="home-page__error">{authError}</p>}
            </form>
          )}
        </div>
      </header>

      <form className="home-page__filters" onSubmit={onSubmitFilters}>
        <Input name="search" type="text" placeholder="Recherche (nom, adresse...)" />
        <Input name="cuisine" type="text" placeholder="Cuisine (Marocaine, Italienne...)" />
        <Button type="submit">Filtrer</Button>
      </form>

      {loading && <p>Chargement des restaurants...</p>}
      {error && <p className="home-page__error">{error}</p>}

      {!loading && !error && (
        <>
          {restaurants.length === 0 ? (
            <p>Aucun restaurant ne correspond a vos filtres.</p>
          ) : (
            <section className="home-page__grid">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  authToken={token}
                  currentUser={user}
                />
              ))}
            </section>
          )}

          <div className="home-page__pagination">
            <Button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              type="button"
            >
              Precedent
            </Button>
            <span>
              Page {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              onClick={() =>
                setPage((prev) => Math.min(pagination.totalPages, prev + 1))
              }
              disabled={page >= pagination.totalPages}
              type="button"
            >
              Suivant
            </Button>
          </div>
        </>
      )}
    </main>
  );
};

export default HomePage;
