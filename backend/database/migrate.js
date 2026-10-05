import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { pool } from "../src/config/db.js";

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrate = async () => {
  try {
    // Read schema.sql
    const schemaPath = path.join(__dirname, "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    // Execute schema
    await pool.query(sql);
    console.log("Database migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    // Close PostgreSQL connection pool
    await pool.end();
  }
};

migrate();
