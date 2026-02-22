import { z } from "zod";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { UrlService } from "../application/url.service.js";

const shortenBodySchema = z.object({
  url: z.string().url("Invalid URL format"),
});

const resolveParamsSchema = z.object({
  shortCode: z.string().min(1),
});

export function registerRoutes(app: FastifyInstance, urlService: UrlService) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post("/api/shorten", {
    schema: { body: shortenBodySchema },
  }, async (request, reply) => {
    const { url } = request.body;

    const result = await urlService.shortenUrl(url);
    const shortUrl = `${request.protocol}://${request.host}/${result.shortCode}`;

    return reply.status(201).send({
      shortCode: result.shortCode,
      shortUrl,
      originalUrl: result.originalUrl,
    });
  });

  typedApp.get("/:shortCode", {
    schema: { params: resolveParamsSchema },
  }, async (request, reply) => {
    const { shortCode } = request.params;
    const originalUrl = await urlService.resolveUrl(shortCode);
    return reply.status(301).redirect(originalUrl);
  });
}
