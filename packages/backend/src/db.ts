import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function createDrizzleDb(databaseUrl: string) {
  const client = postgres(databaseUrl);
  return drizzle(client);
}

export type Database = ReturnType<typeof createDrizzleDb>;
