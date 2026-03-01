import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  shortCode: varchar("short_code", { length: 11 }).notNull().unique(),
  originalUrl: text("original_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
