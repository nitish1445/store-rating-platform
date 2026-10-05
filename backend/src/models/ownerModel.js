import { pool } from "../config/db.js";

const Owner = {
  // =========================
  // PROFILE
  // =========================

  async getProfile(ownerId) {
    const query = `
      SELECT
        id,
        name,
        email,
        address,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
        AND role = 'owner';
    `;

    const result = await pool.query(query, [ownerId]);

    return result.rows[0];
  },

  async updatePassword(ownerId, password) {
    const query = `
    UPDATE users
    SET
      password = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
      AND role = 'owner'
    RETURNING
      id,
      name,
      email,
      address,
      role,
      updated_at;
  `;

    const values = [password, ownerId];

    try {
      const result = await pool.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("Error updating owner password:", error);
      throw error;
    }
  },

  async getOverview(ownerId) {
    const query = `
      SELECT
        s.id AS store_id,
        s.name AS store_name,
        s.email AS store_email,
        s.address AS store_address,

        COUNT(r.id)::int AS total_ratings,

        COALESCE(
          ROUND(AVG(r.rating), 1),
          0
        ) AS average_rating,

        COUNT(DISTINCT r.user_id)::int AS total_customers

      FROM stores s
      LEFT JOIN ratings r
        ON r.store_id = s.id

      WHERE s.owner_id = $1

      GROUP BY
        s.id,
        s.name,
        s.email,
        s.address;
    `;

    const result = await pool.query(query, [ownerId]);

    return result.rows[0];
  },

  async getStore(ownerId) {
    const query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        s.created_at,
        s.updated_at,

        COUNT(r.id)::int AS total_ratings,

        COALESCE(
          ROUND(AVG(r.rating), 1),
          0
        ) AS average_rating

      FROM stores s

      LEFT JOIN ratings r
        ON r.store_id = s.id

      WHERE s.owner_id = $1

      GROUP BY s.id;
    `;

    const result = await pool.query(query, [ownerId]);

    return result.rows[0];
  },

  async getStoreById(ownerId, storeId) {
    const query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        s.created_at,
        s.updated_at,

        COUNT(r.id)::int AS total_ratings,

        COALESCE(
          ROUND(AVG(r.rating), 1),
          0
        ) AS average_rating

      FROM stores s

      LEFT JOIN ratings r
        ON r.store_id = s.id

      WHERE s.id = $1
        AND s.owner_id = $2

      GROUP BY s.id;
    `;

    const result = await pool.query(query, [storeId, ownerId]);

    return result.rows[0];
  },

  async updateStore(ownerId, storeId, storeData) {
    const { name, email, address } = storeData;

    const query = `
      UPDATE stores
      SET
        name = $1,
        email = $2,
        address = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
        AND owner_id = $5

      RETURNING
        id,
        name,
        email,
        address,
        owner_id,
        created_at,
        updated_at;
    `;

    const values = [name, email, address, storeId, ownerId];

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  async deleteStore(ownerId, storeId) {
    const query = `
      DELETE FROM stores
      WHERE id = $1
        AND owner_id = $2

      RETURNING id, name;
    `;

    const result = await pool.query(query, [storeId, ownerId]);

    return result.rows[0];
  },

  async getRatings(ownerId) {
    const query = `
      SELECT
        r.id,
        r.rating,
        r.created_at,
        r.updated_at,

        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.address AS user_address,

        s.id AS store_id,
        s.name AS store_name,
        s.address AS store_address

      FROM ratings r

      INNER JOIN users u
        ON u.id = r.user_id

      INNER JOIN stores s
        ON s.id = r.store_id

      WHERE s.owner_id = $1

      ORDER BY r.updated_at DESC;
    `;

    const result = await pool.query(query, [ownerId]);

    return result.rows;
  },

  async getRatingById(ownerId, ratingId) {
    const query = `
      SELECT
        r.id,
        r.rating,
        r.created_at,
        r.updated_at,

        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.address AS user_address,

        s.id AS store_id,
        s.name AS store_name,
        s.email AS store_email,
        s.address AS store_address

      FROM ratings r

      INNER JOIN users u
        ON u.id = r.user_id

      INNER JOIN stores s
        ON s.id = r.store_id

      WHERE r.id = $1
        AND s.owner_id = $2;
    `;

    const result = await pool.query(query, [ratingId, ownerId]);

    return result.rows[0];
  },

  async getCustomers(ownerId) {
    const query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,

        COUNT(r.id)::int AS total_ratings,

        ROUND(AVG(r.rating), 1) AS average_rating,

        MAX(r.updated_at) AS last_rated_at

      FROM users u

      INNER JOIN ratings r
        ON r.user_id = u.id

      INNER JOIN stores s
        ON s.id = r.store_id

      WHERE s.owner_id = $1

      GROUP BY
        u.id,
        u.name,
        u.email,
        u.address

      ORDER BY last_rated_at DESC;
    `;

    const result = await pool.query(query, [ownerId]);

    return result.rows;
  },

  async getCustomerById(ownerId, customerId) {
    const query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,

        r.id AS rating_id,
        r.rating,
        r.created_at,
        r.updated_at,

        s.id AS store_id,
        s.name AS store_name

      FROM users u

      INNER JOIN ratings r
        ON r.user_id = u.id

      INNER JOIN stores s
        ON s.id = r.store_id

      WHERE u.id = $1
        AND s.owner_id = $2

      ORDER BY r.updated_at DESC;
    `;

    const result = await pool.query(query, [customerId, ownerId]);

    return result.rows;
  },
};

export default Owner;
