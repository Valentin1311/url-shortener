import Fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import type { Config } from "./config";
import { createDrizzleDb } from "./db";
import { createDrizzleUrlRepository } from "./repository/url.repository";
import { createUrlService } from "./application/url.service";
import { registerUrlRoutes } from "./presentation/routes";
import { globalErrorHandler } from "./presentation/error-handler";
import { createSnowflakeShortCodeGenerator } from "./application/short-code.service";

export async function buildApp(config: Config) {
  const db = createDrizzleDb(config.DATABASE_URL);
  const urlRepository = createDrizzleUrlRepository(db);
  const shortCodeGenerator = createSnowflakeShortCodeGenerator();
  const urlService = createUrlService({ urlRepository, shortCodeGenerator });

  const app = Fastify({ logger: true, trustProxy: true });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, { origin: true });

  app.setErrorHandler(globalErrorHandler);

  app.get("/health", async () => ({ status: "ok" }));

  registerUrlRoutes(app, urlService);

  return app;
}
