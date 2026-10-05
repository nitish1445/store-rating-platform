import "dotenv/config";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl && !process.env.DB_HOST) {
  throw new Error(
    "Database configuration is missing. Set DATABASE_URL or DB_HOST, DB_USER, DB_NAME, DB_PASSWORD, and DB_PORT in backend/.env.",
  );
}

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL connected successfully");
    client.release();
  } catch (error) {
    console.error(
      "Error connecting to PostgreSQL database:",
      error instanceof AggregateError
        ? error.errors
        : error instanceof Error
          ? error.message
          : error,
    );
    process.exit(1);
  }
};

export { pool };
export default connectDB;
