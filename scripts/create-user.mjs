/**
 * Script to create a user in the database
 * Usage: node scripts/create-user.mjs <email> <password>
 */

import argon2 from "argon2";
import pg from "pg";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const eqIndex = trimmed.indexOf("=");
        if (eqIndex > 0) {
          const key = trimmed.slice(0, eqIndex).trim();
          const value = trimmed.slice(eqIndex + 1).trim();
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    }
  } catch (err) {
    console.log("Note: Could not load .env.local, using existing env vars");
  }
}

loadEnv();

const { Pool } = pg;

async function hashPassword(password) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

async function createUser(email, password) {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error("ERROR: DATABASE_URL environment variable is not set");
    console.log("Please set DATABASE_URL in your .env.local file");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Hash the password
    console.log(`Hashing password for ${email}...`);
    const passwordHash = await hashPassword(password);

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id, email FROM app_users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log(`User ${email} already exists with ID: ${existingUser.rows[0].id}`);
      console.log("Updating password...");
      
      await pool.query(
        "UPDATE app_users SET password_hash = $1, updated_at = NOW() WHERE LOWER(email) = LOWER($2)",
        [passwordHash, email]
      );
      
      console.log("Password updated successfully!");
      return existingUser.rows[0];
    }

    // Insert new user
    console.log("Creating new user...");
    const result = await pool.query(
      `INSERT INTO app_users (email, password_hash, created_at, updated_at)
       VALUES (LOWER($1), $2, NOW(), NOW())
       RETURNING id, email, created_at`,
      [email, passwordHash]
    );

    const user = result.rows[0];
    console.log("User created successfully!");
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Created: ${user.created_at}`);

    return user;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Get arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log("Usage: node scripts/create-user.mjs <email> <password>");
  console.log("Example: node scripts/create-user.mjs user@example.com mypassword123");
  process.exit(1);
}

createUser(email, password)
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed:", error);
    process.exit(1);
  });
