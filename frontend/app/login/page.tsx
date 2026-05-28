"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { postJson } from "../../lib/api";
import { useEffect } from "react";
import { getJson } from "../../lib/api";

type LoginResponse = {
  message: string;
  role: "student" | "recruiter";
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await postJson<LoginResponse>("/api/auth/login", { email, password });
      router.push(result.role === "student" ? "/student" : "/recruiter");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await getJson<{ role: "student" | "recruiter" }>("/api/auth/me");
        if (!mounted) return;
        router.replace(me.role === "student" ? "/student" : "/recruiter");
      } catch {
        // not authenticated — ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-16">
      <section className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-950">Login</h1>
          <p className="text-sm text-slate-600">JWT auth will be stored in HttpOnly cookies.</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Email</span>
            <input
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Password</span>
            <input
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <p className="mt-4 text-sm text-slate-600">
            No account? <a className="text-slate-950 underline" href="/register">Create one</a>
          </p>

          <button
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
