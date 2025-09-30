import { Link, useLocation } from "react-router-dom";
import {
  Boxes,
  ChevronLeft,
  Inbox,
  LayoutDashboard,
  MessageSquareMore,
  Settings,
  TrendingUp,
  Users2,
} from "lucide-react";
import { useMemo } from "react";

interface SidebarProps {
  collapsed: boolean;
  onCollapseToggle: () => void;
}

export default function Sidebar({ collapsed, onCollapseToggle }: SidebarProps) {
  const { pathname } = useLocation();

  const items = useMemo(
    () => [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/team-chat", icon: MessageSquareMore, label: "Team Chat" },
      { to: "/inbox", icon: Inbox, label: "Inbox" },
      { to: "/distributor", icon: Boxes, label: "Distributor" },
      { to: "/sales-tracker", icon: TrendingUp, label: "Sales Tracker" },
      { to: "/team-management", icon: Users2, label: "Team Management" },
      { to: "/settings", icon: Settings, label: "Settings" },
    ],
    [],
  );

  return (
    <aside
      className={`shrink-0 transition-[width] duration-300 ${collapsed ? "w-20" : "w-64"}`}
      aria-label="Sidebar navigation"
    >
      <div className="sticky top-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col rounded-2xl border border-black/5 bg-white/80 px-3 py-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-neutral-900/70">
            <div className="flex items-center gap-3 px-1 pb-3">
              {!collapsed && (
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Studio Admin
                  </p>
                </div>
              )}
              <button
                onClick={onCollapseToggle}
                className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-black/5 bg-white/70 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-neutral-800/70 dark:hover:bg-neutral-800"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronLeft
                  className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </div>
            <nav className="flex-1 space-y-1 pt-1 text-sm">
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                      active
                        ? "bg-emerald-500 text-white shadow"
                        : "text-neutral-500 hover:bg-black/5 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
