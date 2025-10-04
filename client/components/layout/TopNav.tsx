import {
  CircleUserRound,
  Moon,
  Search,
  Settings,
  SunMedium,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TopNav() {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  return (
    <header className="sticky top-0 z-40 flex flex-col">
      <div className="flex h-16 w-full items-center gap-3 rounded-2xl border border-black/5 bg-white/80 px-3 py-3 shadow-sm backdrop-blur transition dark:border-white/10 dark:bg-neutral-900/70">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="search"
            placeholder="Search"
            className="h-10 w-full rounded-xl border border-black/10 bg-white pl-9 pr-4 text-sm text-neutral-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white"
          />
        </label>
        <div className="ml-auto flex items-center gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-neutral-600 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-200"
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            aria-label="Toggle theme"
            onClick={() =>
              setTheme((state) => (state === "light" ? "dark" : "light"))
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-neutral-600 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-200"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <SunMedium className="h-5 w-5" />
            )}
          </button>
          <div className="relative">
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-gradient-to-br from-emerald-400 via-sky-400 to-indigo-500 text-white shadow-sm transition hover:brightness-110 dark:border-white/10"
              aria-label="Account menu"
            >
              <CircleUserRound className="h-5 w-5" />
            </button>
            <div className="absolute right-0 mt-12 w-48 rounded-lg bg-white shadow-lg p-2 text-sm">
              <button
                onClick={() => { try { localStorage.removeItem('token'); } catch {} ; navigate('/login'); }}
                className="w-full text-left px-2 py-2 hover:bg-slate-100 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
