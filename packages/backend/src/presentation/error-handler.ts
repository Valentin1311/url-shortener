import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ApplicationError } from "../errors";

const kindToStatus: Record<string, number> = {
  NOT_FOUND: 404,
  DATABASE_ERROR: 500,
};

export function globalErrorHandler(
  error: FastifyError | ApplicationError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const issues = error.validation.map((v) => v.message);
    return reply.status(400).send({
      message: "Bad request",
      details: issues,
    });
  }

  if (error instanceof ApplicationError) {
    const status = kindToStatus[error.kind] ?? 500;
    return reply.status(status).send({ error: error.message });
  }

  request.log.error(error);
  return reply.status(500).send({ error: "Internal server error" });
}
