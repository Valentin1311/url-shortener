import { Snowflake } from "@sapphire/snowflake";

const CUSTOM_EPOCH = new Date("2025-01-01T00:00:00.000Z");

const snowflake = new Snowflake(CUSTOM_EPOCH);

export function createUniqueIdGenerator(): () => bigint {
  return () => snowflake.generate();
}
