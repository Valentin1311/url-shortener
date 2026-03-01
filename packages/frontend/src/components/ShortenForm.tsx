import { useState, type FormEvent } from "react";
import { shortenUrl, type ShortenResult } from "../api/shorten";

export function ShortenForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenResult, setShortenResult] = useState<ShortenResult | null>(null);
  const [shortenError, setShortenError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setShortenError("");
    setShortenResult(null);
    setLoading(true);

    try {
      const shortenResult = await shortenUrl(originalUrl);
      setShortenResult(shortenResult);
      await copyToClipboard(shortenResult.shortUrl);
    } catch (error) {
      setShortenError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={originalUrl}
          onChange={(event) => setOriginalUrl(event.target.value)}
          placeholder="https://example.com/very-long-url"
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!originalUrl.trim() || loading}
          className="rounded-lg bg-indigo-500 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      {shortenError && (
        <p className="text-sm text-rose-400">{shortenError}</p>
      )}

      {shortenResult && (
        <div className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-3">
          <a
            href={shortenResult.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate font-mono text-sm text-indigo-400 hover:underline"
          >
            {shortenResult.shortUrl}
          </a>
          <button
            type="button"
            onClick={() => copyToClipboard(shortenResult.shortUrl)}
            className="shrink-0 rounded-md border border-zinc-600 px-2.5 py-1 text-xs text-zinc-300 transition hover:bg-zinc-700"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </form>
  );
}
