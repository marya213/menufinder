const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export const restaurantApi = {
  async getAll(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.q) searchParams.set("q", params.q);
    if (params.cuisine) searchParams.set("cuisine", params.cuisine);

    const response = await fetch(
      `${API_BASE_URL}/restaurants?${searchParams.toString()}`
    );
    if (!response.ok) {
      throw new Error("Impossible de recuperer les restaurants.");
    }
    return response.json();
  }
};
