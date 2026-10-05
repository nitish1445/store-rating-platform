import { pool } from "../config/db.js";

const User = {
  async getProfile(userId) {
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
        AND role = 'user';
    `;

    const values = [userId];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  async updatePassword(userId, password) {
    const query = `
    UPDATE users
    SET
      password = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
      AND role = 'user'
    RETURNING
      id,
      name,
      email,
      role,
      updated_at;
  `;

    const values = [password, userId];

    try {
      const result = await pool.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("Error updating user password:", error);
      throw error;
    }
  },

  async getAllStores() {
    const query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,

        COALESCE(
          ROUND(AVG(r.rating), 1),
          0
        ) AS overall_rating,

        COUNT(r.id)::int AS total_ratings

      FROM stores s

      LEFT JOIN ratings r
        ON r.store_id = s.id

      GROUP BY s.id

      ORDER BY s.name ASC;
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching all stores:", error);
      throw error;
    }
  },

  async getStoreById(storeId, userId) {
    const query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,

        COALESCE(
          ROUND(AVG(all_ratings.rating), 1),
          0
        ) AS overall_rating,

        COUNT(all_ratings.id)::int AS total_ratings,

        user_rating.rating AS user_rating,
        user_rating.created_at AS user_rating_created_at,
        user_rating.updated_at AS user_rating_updated_at

      FROM stores s

      LEFT JOIN ratings all_ratings
        ON all_ratings.store_id = s.id

      LEFT JOIN ratings user_rating
        ON user_rating.store_id = s.id
        AND user_rating.user_id = $2

      WHERE s.id = $1

      GROUP BY
        s.id,
        user_rating.rating,
        user_rating.created_at,
        user_rating.updated_at;
    `;

    const values = [storeId, userId];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching store by ID:", error);
      throw error;
    }
  },

  async getMyRatings(userId) {
    const query = `
      SELECT
        r.id,
        r.rating,
        r.created_at,
        r.updated_at,

        s.id AS store_id,
        s.name AS store_name,
        s.email AS store_email,
        s.address AS store_address,

        COALESCE(
          (
            SELECT ROUND(AVG(sr.rating), 1)
            FROM ratings sr
            WHERE sr.store_id = s.id
          ),
          0
        ) AS overall_rating,

        COUNT(*) OVER (
          PARTITION BY r.user_id
        )::int AS total_user_ratings

      FROM ratings r

      INNER JOIN stores s
        ON s.id = r.store_id

      WHERE r.user_id = $1

      ORDER BY r.updated_at DESC;
    `;

    const values = [userId];

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error fetching my ratings:", error);
      throw error;
    }
  },

  async getMyRatingForStore(userId, storeId) {
    const query = `
      SELECT
        r.id,
        r.user_id,
        r.store_id,
        r.rating,
        r.created_at,
        r.updated_at,

        s.name AS store_name,
        s.address AS store_address

      FROM ratings r

      INNER JOIN stores s
        ON s.id = r.store_id

      WHERE r.user_id = $1
        AND r.store_id = $2;
    `;

    const values = [userId, storeId];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching user's store rating:", error);
      throw error;
    }
  },

  async createOrUpdateRating(userId, storeId, rating) {
    const query = `
      INSERT INTO ratings (
        user_id,
        store_id,
        rating
      )
      VALUES ($1, $2, $3)

      ON CONFLICT (user_id, store_id)

      DO UPDATE SET
        rating = EXCLUDED.rating,
        updated_at = CURRENT_TIMESTAMP

      RETURNING
        id,
        user_id,
        store_id,
        rating,
        created_at,
        updated_at;
    `;

    const values = [userId, storeId, rating];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating/updating rating:", error);
      throw error;
    }
  },

  async deleteMyRating(userId, storeId) {
    const query = `
      DELETE FROM ratings
      WHERE user_id = $1
        AND store_id = $2

      RETURNING
        id,
        user_id,
        store_id,
        rating;
    `;

    const values = [userId, storeId];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting user rating:", error);
      throw error;
    }
  },
};

export default User;
