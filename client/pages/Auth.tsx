import TopNav from "@/components/layout/TopNav";
import { useState } from "react";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-[oklch(0.9789_0.0082_121.627)] dark:bg-neutral-950">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-black/5 bg-white/80 dark:bg-neutral-900/70 backdrop-blur p-6 shadow-lg">
            <div className="flex gap-2 p-1 rounded-xl bg-black/5 dark:bg-white/5">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${mode === "login" ? "bg-white shadow dark:bg-neutral-800" : "text-muted-foreground"}`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${mode === "register" ? "bg-white shadow dark:bg-neutral-800" : "text-muted-foreground"}`}
              >
                Register
              </button>
            </div>

            <form className="mt-6 space-y-4">
              {mode === "register" && (
                <div>
                  <label className="text-sm font-medium">Full name</label>
                  <input className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-neutral-900/50" />
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-neutral-900/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-neutral-900/50"
                />
              </div>
              {mode === "register" && (
                <div>
                  <label className="text-sm font-medium">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-neutral-900/50"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 text-white py-2.5 font-medium shadow hover:bg-emerald-600"
              >
                {mode === "login" ? "Login" : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
