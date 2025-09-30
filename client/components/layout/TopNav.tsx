import { Link, useLocation } from "react-router-dom";
import { Menu, SunMedium, Moon, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

interface TopNavProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export default function TopNav({ onToggleSidebar, showSidebarToggle = false }: TopNavProps) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => (document.documentElement.classList.contains("dark") ? "dark" : "light"));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/team-chat", label: "Team Chat" },
    { to: "/inbox", label: "Inbox" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${scrolled ? "backdrop-blur bg-white/70 dark:bg-neutral-900/60 shadow-sm" : "bg-transparent"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
        {showSidebarToggle && (
          <button
            onClick={onToggleSidebar}
            className="-ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md border border-black/5 bg-white/70 dark:bg-neutral-800/70 shadow-sm hover:bg-white/90 dark:hover:bg-neutral-800"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-400 to-sky-400 ring-1 ring-black/5 shadow" />
          <span className="hidden sm:block">SoftPop CRM</span>
        </Link>
        <nav className="ml-auto hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`transition-colors hover:text-foreground ${pathname === l.to ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/auth" className="text-muted-foreground hover:text-foreground">Login</Link>
          <Link to="/auth" className="inline-flex items-center gap-2 rounded-md bg-emerald-500 text-white px-3 py-1.5 shadow hover:bg-emerald-600">
            <UsersRound className="h-4 w-4" /> Register
          </Link>
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md border border-black/5 bg-white/70 dark:bg-neutral-800/70 shadow-sm hover:bg-white/90 dark:hover:bg-neutral-800"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
