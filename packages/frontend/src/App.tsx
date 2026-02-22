import { ShortenForm } from "./components/ShortenForm";

export function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 px-4">
      <main className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <h1 className="mb-1 text-2xl font-bold text-white">URL Shortener</h1>
        <p className="mb-6 text-sm text-zinc-400">
          Paste a long URL and get a short, shareable link.
        </p>
        <ShortenForm />
      </main>
    </div>
  );
}
