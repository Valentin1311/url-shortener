import Fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import type { Config } from "./config.js";
import { createDrizzleDb } from "./db.js";
import { createDrizzleUrlRepository } from "./repository/url.repository.js";
import { createUrlService } from "./application/url.service.js";
import { createUniqueIdGenerator } from "./lib/snowflake.js";
import { base62Encode } from "./lib/base62.js";
import { registerRoutes } from "./presentation/routes.js";
import { errorHandler } from "./presentation/error-handler.js";

export async function buildApp(config: Config) {
  const db = createDrizzleDb(config.DATABASE_URL);
  const repository = createDrizzleUrlRepository(db);
  const generateUniqueId = createUniqueIdGenerator();
  const urlService = createUrlService({ repository, generateUniqueId, base62Encode });

  const app = Fastify({ logger: true, trustProxy: true });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, { origin: true });

  app.setErrorHandler(errorHandler);

  app.get("/health", async () => ({ status: "ok" }));

  registerRoutes(app, urlService);

  return app;
}
