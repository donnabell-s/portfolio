import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const isNeon = connectionString.includes('neon.tech');

/**
 * Neon's HTTP driver in production/Vercel: each query is a stateless HTTP
 * call, so there is no connection pool to exhaust across concurrent
 * serverless invocations (the failure mode a classic pg Pool hits there).
 *
 * A plain node-postgres Pool for local dev instead, since a local Postgres
 * server has no SQL-over-HTTP endpoint for the Neon driver to talk to, and
 * a single long-lived dev process has no pool-exhaustion risk to begin with.
 */
export const db = isNeon
  ? drizzleNeon(neon(connectionString), { schema })
  : drizzlePg(new Pool({ connectionString }), { schema });
