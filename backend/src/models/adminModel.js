import { pool } from "../config/db.js";

const Admin = {
  async getOverview() {
    const query = `
      SELECT
        (SELECT COUNT(*)::int FROM users) AS total_users,
        (SELECT COUNT(*)::int FROM stores) AS total_stores,
        (SELECT COUNT(*)::int FROM ratings) AS total_ratings;
    `;

    const result = await pool.query(query);

    return result.rows[0];
  },

  async getUsers(filters = {}) {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      sortOrder = "asc",
    } = filters;

    const allowedSortFields = {
      name: "u.name",
      email: "u.email",
      address: "u.address",
      role: "u.role",
      created_at: "u.created_at",
    };

    const sortColumn = allowedSortFields[sortBy] || "u.name";

    const order = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    const conditions = ["u.role IN ('user', 'admin', 'owner')"];

    const values = [];
    let index = 1;

    if (name?.trim()) {
      conditions.push(`u.name ILIKE $${index}`);
      values.push(`%${name.trim()}%`);
      index++;
    }

    if (email?.trim()) {
      conditions.push(`u.email ILIKE $${index}`);
      values.push(`%${email.trim()}%`);
      index++;
    }

    if (address?.trim()) {
      conditions.push(`u.address ILIKE $${index}`);
      values.push(`%${address.trim()}%`);
      index++;
    }

    if (role && ["admin", "user", "owner"].includes(role)) {
      conditions.push(`u.role = $${index}`);
      values.push(role);
      index++;
    }

    const query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        u.created_at,
        u.updated_at,

        CASE
          WHEN u.role = 'owner'
          THEN COALESCE(
            (
              SELECT ROUND(AVG(r.rating), 1)
              FROM ratings r
              INNER JOIN stores s
                ON s.id = r.store_id
              WHERE s.owner_id = u.id
            ),
            0
          )
          ELSE NULL
        END AS owner_rating

      FROM users u

      WHERE ${conditions.join(" AND ")}

      ORDER BY ${sortColumn} ${order};
    `;

    const result = await pool.query(query, values);

    return result.rows;
  },

  async getUserById(userId) {
    const query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        u.created_at,
        u.updated_at,

        CASE
          WHEN u.role = 'owner'
          THEN COALESCE(
            (
              SELECT ROUND(AVG(r.rating), 1)
              FROM ratings r
              INNER JOIN stores s
                ON s.id = r.store_id
              WHERE s.owner_id = u.id
            ),
            0
          )
          ELSE NULL
        END AS owner_rating,

        CASE
          WHEN u.role = 'owner'
          THEN (
            SELECT COUNT(*)::int
            FROM stores s
            WHERE s.owner_id = u.id
          )
          ELSE 0
        END AS total_stores

      FROM users u
      WHERE u.id = $1;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows[0];
  },

  async createUser(userData) {
    const { name, email, address, password, role } = userData;

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

    const result = await pool.query(query, [
      name,
      email,
      address,
      password,
      role,
    ]);

    return result.rows[0];
  },

  async updateUser(userId, userData) {
    const { name, email, address, role } = userData;

    const query = `
      UPDATE users
      SET
        name = $1,
        email = $2,
        address = $3,
        role = $4,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $5

      RETURNING
        id,
        name,
        email,
        address,
        role,
        created_at,
        updated_at;
    `;

    const result = await pool.query(query, [
      name,
      email,
      address,
      role,
      userId,
    ]);

    return result.rows[0];
  },

  async deleteUser(userId) {
    const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id, name, role;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows[0];
  },

  async getOwners() {
    const query = `
      SELECT
        id,
        name,
        email,
        address,
        role
      FROM users
      WHERE role = 'owner'
      ORDER BY name ASC;
    `;

    const result = await pool.query(query);

    return result.rows;
  },

  async getStores(filters = {}) {
    const {
      name,
      email,
      address,
      sortBy = "name",
      sortOrder = "asc",
    } = filters;

    const allowedSortFields = {
      name: "s.name",
      email: "s.email",
      address: "s.address",
      rating: "overall_rating",
      created_at: "s.created_at",
    };

    const sortColumn = allowedSortFields[sortBy] || "s.name";

    const order = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    const conditions = [];
    const values = [];
    let index = 1;

    if (name?.trim()) {
      conditions.push(`s.name ILIKE $${index}`);
      values.push(`%${name.trim()}%`);
      index++;
    }

    if (email?.trim()) {
      conditions.push(`s.email ILIKE $${index}`);
      values.push(`%${email.trim()}%`);
      index++;
    }

    if (address?.trim()) {
      conditions.push(`s.address ILIKE $${index}`);
      values.push(`%${address.trim()}%`);
      index++;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,

        u.name AS owner_name,
        u.email AS owner_email,

        COALESCE(
          ROUND(AVG(r.rating), 1),
          0
        ) AS overall_rating,

        COUNT(r.id)::int AS total_ratings,

        s.created_at,
        s.updated_at

      FROM stores s

      INNER JOIN users u
        ON u.id = s.owner_id

      LEFT JOIN ratings r
        ON r.store_id = s.id

      ${whereClause}

      GROUP BY
        s.id,
        u.name,
        u.email

      ORDER BY ${sortColumn} ${order};
    `;

    const result = await pool.query(query, values);

    return result.rows;
  },

  async getStoreById(storeId) {
    const query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,

        u.name AS owner_name,
        u.email AS owner_email,

        COALESCE(
          ROUND(AVG(r.rating), 1),
          0
        ) AS overall_rating,

        COUNT(r.id)::int AS total_ratings,

        s.created_at,
        s.updated_at

      FROM stores s

      INNER JOIN users u
        ON u.id = s.owner_id

      LEFT JOIN ratings r
        ON r.store_id = s.id

      WHERE s.id = $1

      GROUP BY
        s.id,
        u.name,
        u.email;
    `;

    const result = await pool.query(query, [storeId]);

    return result.rows[0];
  },

  async createStore(storeData) {
    const { name, email, address, ownerId } = storeData;

    const query = `
      INSERT INTO stores (
        name,
        email,
        address,
        owner_id
      )
      VALUES ($1, $2, $3, $4)

      RETURNING
        id,
        name,
        email,
        address,
        owner_id,
        created_at;
    `;

    const result = await pool.query(query, [name, email, address, ownerId]);

    return result.rows[0];
  },

  async updateStore(storeId, storeData) {
    const { name, email, address, ownerId } = storeData;

    const query = `
      UPDATE stores
      SET
        name = $1,
        email = $2,
        address = $3,
        owner_id = $4,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $5

      RETURNING
        id,
        name,
        email,
        address,
        owner_id,
        created_at,
        updated_at;
    `;

    const result = await pool.query(query, [
      name,
      email,
      address,
      ownerId,
      storeId,
    ]);

    return result.rows[0];
  },

  async deleteStore(storeId) {
    const query = `
      DELETE FROM stores
      WHERE id = $1

      RETURNING id, name;
    `;

    const result = await pool.query(query, [storeId]);

    return result.rows[0];
  },

  async getRatings() {
    const query = `
      SELECT
        r.id,
        r.rating,
        r.created_at,
        r.updated_at,

        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,

        s.id AS store_id,
        s.name AS store_name,

        owner.name AS owner_name

      FROM ratings r

      INNER JOIN users u
        ON u.id = r.user_id

      INNER JOIN stores s
        ON s.id = r.store_id

      INNER JOIN users owner
        ON owner.id = s.owner_id

      ORDER BY r.updated_at DESC;
    `;

    const result = await pool.query(query);
    return result.rows;
  },

  async getRatingById(ratingId) {
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
        s.address AS store_address,

        owner.id AS owner_id,
        owner.name AS owner_name,
        owner.email AS owner_email

      FROM ratings r

      INNER JOIN users u
        ON u.id = r.user_id

      INNER JOIN stores s
        ON s.id = r.store_id

      INNER JOIN users owner
        ON owner.id = s.owner_id

      WHERE r.id = $1;
    `;

    const result = await pool.query(query, [ratingId]);
    return result.rows[0];
  },

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
      AND role = 'admin';
  `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  },
};

export default Admin;
