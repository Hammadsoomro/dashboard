import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-[oklch(0.9789_0.0082_121.627)] dark:bg-neutral-950">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_300px_at_20%_20%,rgba(16,185,129,0.18),transparent),radial-gradient(500px_240px_at_80%_10%,rgba(56,189,248,0.22),transparent)]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/70 to-transparent dark:from-neutral-900/80" />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-3xl border border-black/5 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-white/5 dark:bg-neutral-900/70 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
              Studio Admin
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
              Manage your workflow with confidence
            </h1>
            <p className="text-base text-neutral-600 dark:text-neutral-300">
              Access dashboards, analytics, and collaboration tools after you sign in. Get started by creating an account or logging into your workspace.
            </p>
          </div>
          <div className="w-full max-w-xs space-y-4">
            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-base font-semibold text-white shadow hover:bg-emerald-600"
            >
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black/5 bg-white px-5 py-3 text-base font-semibold text-neutral-800 shadow-sm hover:bg-white/90 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
            >
              Login
            </Link>
            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
              All product features unlock right after login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
