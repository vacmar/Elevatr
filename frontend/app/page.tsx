export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <div className="max-w-2xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Elevatr</p>
        <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          A job portal built for students and recruiters.
        </h1>
        <p className="text-lg leading-8 text-slate-700">
          This scaffold is the starting point for the Next.js frontend, FastAPI backend, and PostgreSQL data layer.
        </p>
        <div className="flex gap-3">
          <a className="rounded-full bg-slate-950 px-5 py-3 text-white" href="/login">
            Login
          </a>
          <a className="rounded-full border border-slate-300 px-5 py-3 text-slate-950" href="/register">
            Register
          </a>
        </div>
      </div>
    </main>
  );
}
