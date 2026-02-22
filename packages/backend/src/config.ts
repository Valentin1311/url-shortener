import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().default(3000),
});

export type Config = z.infer<typeof envSchema>;

export function validateEnv(): Config {
  return envSchema.parse(process.env);
}
