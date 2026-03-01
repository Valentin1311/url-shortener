import { createSnowflakeUniqueIdGenerator } from "../lib/snowflake";
import { base62Encode } from "../lib/base62";

export interface ShortCodeGenerator {
  generateShortCode(originalUrl?: string): string;
}

export function createSnowflakeShortCodeGenerator(): ShortCodeGenerator {
  const generateUniqueSnowflakeId = createSnowflakeUniqueIdGenerator();

  return {
    generateShortCode(): string {
      const uniqueId = generateUniqueSnowflakeId();
      return base62Encode(uniqueId);
    },
  };
}
