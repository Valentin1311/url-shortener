import { eq } from "drizzle-orm";
import type { Database } from "../db";
import { urls } from "../schema";
import { DatabaseError } from "../errors";

export interface UrlRepository {
  insert(shortCode: string, originalUrl: string): Promise<void>;
  findByShortCode(
    shortCode: string,
  ): Promise<{ shortCode: string; originalUrl: string; createdAt: Date } | null>;
}

export function createDrizzleUrlRepository(db: Database): UrlRepository {
  return {
    async insert(shortCode: string, originalUrl: string) {
      try {
        await db.insert(urls).values({ shortCode, originalUrl });
      } catch (error) {
        throw new DatabaseError(
          `Failed to insert URL: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },

    async findByShortCode(shortCode: string) {
      try {
        const rows = await db
          .select()
          .from(urls)
          .where(eq(urls.shortCode, shortCode))
          .limit(1);

        return rows.length > 0 ? rows[0] : null;
      } catch (error) {
        throw new DatabaseError(
          `Failed to query URL: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },
  };
}
