import type { UrlRepository } from "../repository/url.repository";
import { NotFoundError } from "../errors";
import { ShortCodeGenerator } from "./short-code.service";

interface UrlServiceDeps {
  urlRepository: UrlRepository;
  shortCodeGenerator: ShortCodeGenerator;
}

export function createUrlService({ urlRepository, shortCodeGenerator }: UrlServiceDeps) {
  return {
    async shortenUrl(originalUrl: string) {
      const shortCode = shortCodeGenerator.generateShortCode();

      await urlRepository.insert(shortCode, originalUrl);

      return { shortCode };
    },

    async resolveUrl(shortCode: string) {
      const row = await urlRepository.findByShortCode(shortCode);

      if (!row) {
        throw new NotFoundError(`Short code "${shortCode}" not found`);
      }

      return row.originalUrl;
    },
  };
}

export type UrlService = ReturnType<typeof createUrlService>;
