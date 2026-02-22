export type ErrorKind = "NOT_FOUND" | "DATABASE_ERROR";

export class ApplicationError extends Error {
  constructor(
    public readonly kind: ErrorKind,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super("NOT_FOUND", message);
  }
}

export class DatabaseError extends ApplicationError {
  constructor(message: string) {
    super("DATABASE_ERROR", message);
  }
}
