#!/usr/bin/env node
const { Client } = require("pg");

const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://seeds:seeds@localhost:5432/seeds_db";
const MAX_RETRIES = 20;
const RETRY_INTERVAL_MS = 1000;

async function waitForDb() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const client = new Client({ connectionString: DATABASE_URL });
    try {
      await client.connect();
      await client.end();
      console.log("PostgreSQL listo.");
      process.exit(0);
    } catch {
      console.log(`Esperando a PostgreSQL... (intento ${attempt}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
    }
  }
  console.error("PostgreSQL no respondió a tiempo.");
  process.exit(1);
}

waitForDb();
