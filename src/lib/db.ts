import { neon } from '@neondatabase/serverless';

// Ensure the connection string is defined
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL is not set. Database queries will fail.");
}

// Export the Neon SQL query runner
export const sql = neon(connectionString || '');
