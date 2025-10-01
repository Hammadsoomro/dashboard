import { FormEvent, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Globe } from "lucide-react";

const panelCopy = {
  login: {
    headline: "Login to your account",
    subcopy: "Please enter your details to login.",
    toggleText: "Don't have an account?",
    toggleCta: "Register",
    toggleHref: "/register",
    submitLabel: "Login",
  },
  register: {
    headline: "Create your account",
    subcopy: "Please enter your details to register.",
    toggleText: "Already have an account?",
    toggleCta: "Login",
    toggleHref: "/login",
    submitLabel: "Register",
  },
} as const;

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const mode: "login" | "register" = location.pathname.includes("register")
    ? "register"
    : "login";

  useEffect(() => {
    if (location.pathname === "/auth") {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate]);

  const copy = panelCopy[mode];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "").trim();
    const name = String(form.get("name") ?? "").trim();
    if (!email || !password || (mode === "register" && !name)) {
      alert("Please fill required fields");
      return;
    }

    try {
      if (mode === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          alert(body?.message || "Login failed");
          return;
        }
        const data = await res.json();
        // store token temporarily
        try { localStorage.setItem("token", data.token); } catch {}
        navigate("/dashboard");
      } else {
        // register
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          alert(body?.message || "Register failed");
          return;
        }
        const data = await res.json();
        try { localStorage.setItem("token", data.token); } catch {}
        navigate("/dashboard");
      }
    } catch (e) {
      console.error(e);
      alert("Unexpected error");
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.9789_0.0082_121.627)] dark:bg-neutral-950">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 rounded-3xl border border-black/5 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-white/5 dark:bg-neutral-900/80 sm:p-10 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl bg-[oklch(0.556_0.25_274.4)] px-8 py-10 text-white">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em]">
                <span className="h-2 w-2 rounded-full bg-white/80" /> Studio
                Admin
              </div>
              <h2 className="text-3xl font-semibold">
                Design. Build. Launch. Repeat.
              </h2>
              <p className="text-sm text-white/80">
                Ready to launch? Clone the repo, install dependencies, and your
                dashboard is live in minutes.
              </p>
            </div>
            <div className="space-y-6 text-sm">
              <div>
                <p className="font-semibold">Need help?</p>
                <p className="text-white/80">
                  Check out the docs or open an issue on GitHub, community
                  support is just a click away.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>© 2025, Studio Admin.</span>
                <button className="inline-flex items-center gap-1 rounded-full px-3 py-1 font-medium text-white/80 transition hover:bg-white/10">
                  <Globe className="h-3.5 w-3.5" /> ENG
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-6 flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-300">
              <span>{copy.toggleText}</span>
              <Link
                to={copy.toggleHref}
                className="font-semibold text-emerald-600 hover:text-emerald-500"
              >
                {copy.toggleCta}
              </Link>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
                  {copy.headline}
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {copy.subcopy}
                </p>
              </div>
              <button className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white">
                <span className="grid h-6 w-6 place-items-center rounded-full border border-black/10 bg-white text-xs font-semibold text-neutral-700 dark:border-white/10 dark:text-white">
                  G
                </span>
                Continue with Google
              </button>
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-400">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      Full name
                    </label>
                    <input
                      name="name"
                      required
                      type="text"
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    Email address
                  </label>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white"
                  />
                </div>
                {mode === "register" && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      Confirm password
                    </label>
                    <input
                      required
                      type="password"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white"
                    />
                  </div>
                )}
                {mode === "login" && (
                  <label className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border border-black/20 text-emerald-500 focus:ring-emerald-400"
                    />
                    Remember me for 30 days
                  </label>
                )}
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[oklch(0.556_0.25_274.4)] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[oklch(0.556_0.23_274.4)]"
                >
                  {copy.submitLabel} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
