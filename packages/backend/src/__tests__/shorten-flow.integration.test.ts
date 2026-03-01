import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../app";

const TEST_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/url_shortener";

describe("URL shortening flow", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp({ DATABASE_URL: TEST_DATABASE_URL, PORT: 0 });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should shorten a URL and redirect to the original", async () => {
    const originalUrl = "https://example.com/some-very-long-url";

    const shortenResponse = await app.inject({
      method: "POST",
      url: "/api/shorten",
      payload: { url: originalUrl },
    });

    expect(shortenResponse.statusCode).toBe(201);
    const { shortCode } = shortenResponse.json();
    expect(shortCode).toBeDefined();
    expect(shortCode.length).toBeGreaterThanOrEqual(7);
    expect(shortCode.length).toBeLessThanOrEqual(11);

    const redirectResponse = await app.inject({
      method: "GET",
      url: `/${shortCode}`,
    });

    expect(redirectResponse.statusCode).toBe(301);
    expect(redirectResponse.headers.location).toBe(originalUrl);
  });

  it("should return 400 when no URL is provided", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/shorten",
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 for an invalid URL", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/shorten",
      payload: { url: "not-a-url" },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 404 for a non-existent short code", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/nonExistent",
    });

    expect(response.statusCode).toBe(404);
  });
});
