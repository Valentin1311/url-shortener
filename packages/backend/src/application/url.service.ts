import type { UrlRepository } from "../repository/url.repository.js";
import { NotFoundError } from "../errors.js";

interface UrlServiceDeps {
  repository: UrlRepository;
  generateUniqueId: () => bigint;
  base62Encode: (n: bigint) => string;
}

export function createUrlService({ repository, generateUniqueId, base62Encode }: UrlServiceDeps) {
  return {
    async shortenUrl(originalUrl: string) {
      const uniqueId = generateUniqueId();
      const shortCode = base62Encode(uniqueId);

      await repository.insert(uniqueId, shortCode, originalUrl);

      return { id: uniqueId, shortCode, originalUrl };
    },

    async resolveUrl(shortCode: string) {
      const row = await repository.findByShortCode(shortCode);

      if (!row) {
        throw new NotFoundError(`Short code "${shortCode}" not found`);
      }

      return row.originalUrl;
    },
  };
}

export type UrlService = ReturnType<typeof createUrlService>;
