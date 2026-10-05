import { pool } from "../config/db.js";

const Auth = {
  async createUser(userData) {
    const { name, email, address, password, role = "user" } = userData;

    const query = `
      INSERT INTO users (
        name,
        email,
        address,
        password,
        role
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        email,
        address,
        role,
        created_at;
    `;

    const values = [name, email, address, password, role];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async findUserByEmail(email) {
    const query = `
      SELECT *
      FROM users
      WHERE email = $1;
    `;

    const values = [email];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  },

  async findUserById(id) {
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
      WHERE id = $1;
    `;

    const values = [id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  },
};

export default Auth;
