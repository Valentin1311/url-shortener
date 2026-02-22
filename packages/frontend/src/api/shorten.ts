export interface ShortenResult {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

export async function shortenUrl(url: string): Promise<ShortenResult> {
  const response = await fetch("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? body.error ?? "Failed to shorten URL");
  }

  return body as ShortenResult;
}
