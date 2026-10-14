import { PGlite } from "@electric-sql/pglite";
import { Pool } from "pg";
import { mkdir } from "node:fs/promises";
import path from "node:path";

export type Row = Record<string, unknown>;
export type Query = <T = Row>(sql: string, params?: unknown[]) => Promise<T[]>;
type Database = {
  query: Query;
  close: () => Promise<void>;
  transaction: <T>(fn: (query: Query) => Promise<T>) => Promise<T>;
};
const state = globalThis as typeof globalThis & {
  platformDatabase?: Promise<Database>;
};

const schema = `
CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
 role TEXT NOT NULL CHECK(role IN ('admin','mediator','partner','neet')),
 password_hash TEXT NOT NULL, organization TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
 expires_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS access_requests (
 id TEXT PRIMARY KEY, email TEXT NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL,
 organization TEXT NOT NULL, password_hash TEXT NOT NULL, status TEXT DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS young_people (
 id TEXT PRIMARY KEY, mediator_id TEXT REFERENCES users(id) NOT NULL,
 user_id TEXT UNIQUE REFERENCES users(id), data JSONB NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending', review_note TEXT NOT NULL DEFAULT '',
 created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now(), version INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS offers (
 id TEXT PRIMARY KEY, partner_id TEXT REFERENCES users(id) NOT NULL, data JSONB NOT NULL,
 active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS activities (
 id TEXT PRIMARY KEY, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS participations (
 id TEXT PRIMARY KEY, youth_id TEXT REFERENCES young_people(id) NOT NULL,
 activity_id TEXT REFERENCES activities(id) NOT NULL, attended BOOLEAN DEFAULT false,
 UNIQUE(youth_id, activity_id)
);
CREATE TABLE IF NOT EXISTS referrals (
 id TEXT PRIMARY KEY, youth_id TEXT REFERENCES young_people(id) NOT NULL,
 offer_id TEXT REFERENCES offers(id) NOT NULL, actor_id TEXT REFERENCES users(id) NOT NULL,
 score INTEGER NOT NULL, reasons JSONB NOT NULL, status TEXT DEFAULT 'proposed',
 youth_agreed BOOLEAN NOT NULL, created_at TIMESTAMPTZ DEFAULT now(), UNIQUE(youth_id, offer_id)
);
CREATE TABLE IF NOT EXISTS followups (
 id TEXT PRIMARY KEY, youth_id TEXT REFERENCES young_people(id) NOT NULL,
 actor_id TEXT REFERENCES users(id) NOT NULL, due_date DATE NOT NULL,
 note TEXT NOT NULL, outcome TEXT NOT NULL DEFAULT 'planned', created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS appointments (
 id TEXT PRIMARY KEY, youth_id TEXT REFERENCES young_people(id) NOT NULL,
 actor_id TEXT REFERENCES users(id) NOT NULL, starts_at TIMESTAMPTZ NOT NULL,
 title TEXT NOT NULL, location TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS messages (
 id TEXT PRIMARY KEY, sender_id TEXT REFERENCES users(id) NOT NULL,
 recipient_id TEXT REFERENCES users(id) NOT NULL, body TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit (
 id TEXT PRIMARY KEY, actor_id TEXT REFERENCES users(id), action TEXT NOT NULL,
 entity_id TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS journey_events (
 id TEXT PRIMARY KEY, youth_id TEXT REFERENCES young_people(id) NOT NULL,
 actor_id TEXT REFERENCES users(id) NOT NULL,
 step TEXT NOT NULL CHECK(step IN ('onboarding','activation','insertion','stabilisation')),
 data JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS journey_youth ON journey_events(youth_id);
CREATE UNIQUE INDEX IF NOT EXISTS journey_initial_stage ON journey_events(youth_id,step) WHERE step<>'stabilisation';
CREATE INDEX IF NOT EXISTS youth_mediator ON young_people(mediator_id);
CREATE INDEX IF NOT EXISTS messages_recipient ON messages(recipient_id);
CREATE TABLE IF NOT EXISTS auth_attempts (key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, started_at TIMESTAMPTZ NOT NULL);
`;

export function database(): Promise<Database> {
  if (!state.platformDatabase) state.platformDatabase = initialize().catch(error=>{state.platformDatabase=undefined;throw error;});
  return state.platformDatabase;
}

async function initialize(): Promise<Database> {
  if (process.env.VERCEL === "1" && !process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is required on Vercel. Local PGlite storage is not persistent there.",
    );
  }
  let db: Database;
  if (process.env.DATABASE_URL) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 20000,
    });
    db = {
      close: () => pool.end(),
      query: async <T>(sql: string, params: unknown[] = []) =>
        (await pool.query(sql, params)).rows as T[],
      transaction: async (fn) => {
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          const result = await fn(
            async <T>(sql: string, params: unknown[] = []) =>
              (await client.query(sql, params)).rows as T[],
          );
          await client.query("COMMIT");
          return result;
        } catch (error) {
          await client.query("ROLLBACK");
          throw error;
        } finally {
          client.release();
        }
      },
    };
    // One statement at a time also works with PostgreSQL's prepared-query path.
    const migrationClient=await pool.connect();
    try{await migrationClient.query('SELECT pg_advisory_lock(734901)');await migrationClient.query(schema);}finally{await migrationClient.query('SELECT pg_advisory_unlock(734901)').catch(()=>{});migrationClient.release();}
  } else {
    const directory = path.resolve(
      /* turbopackIgnore: true */ process.env.PLATFORM_DATA_DIR ||
        ".data/postgres",
    );
    await mkdir(directory, { recursive: true });
    const pg = new PGlite(directory);
    await pg.exec(schema);
    db = {
      close: () => pg.close(),
      query: async <T>(sql: string, params: unknown[] = []) =>
        (await pg.query(sql, params)).rows as T[],
      transaction: (fn) =>
        pg.transaction((tx) =>
          fn(
            async <T>(sql: string, params: unknown[] = []) =>
              (await tx.query(sql, params)).rows as T[],
          ),
        ),
    };
  }
  return db;
}
