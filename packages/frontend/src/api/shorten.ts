import { z } from "zod";

const shortenResultSchema = z.object({
  shortCode: z.string(),
  shortUrl: z.string().url(),
});

export type ShortenResult = z.infer<typeof shortenResultSchema>;

export async function shortenUrl(url: string): Promise<ShortenResult> {
  const response = await fetch("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error("Unknown error occurred while shortening the URL");
  }

  const parsed = shortenResultSchema.safeParse(body);

  if (!parsed.success) {
    throw new Error("Unexpected response from server");
  }

  return parsed.data;
}
