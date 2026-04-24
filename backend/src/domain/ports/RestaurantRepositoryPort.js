// Contract for restaurant persistence adapters.
// Expected methods:
// - create(payload)
// - findAll({ page, limit, q, cuisine }) => [items, total]
// - findById(id)
// - updateById(id, payload)
// - deleteById(id)
export const RestaurantRepositoryPort = {};

