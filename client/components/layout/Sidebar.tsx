import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquareMore,
  Inbox,
  Boxes,
  TrendingUp,
  Users2,
  Settings,
  ChevronLeft,
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
      className={`fixed left-4 top-20 z-40 transition-[width] ${collapsed ? "w-16" : "w-64"}`}
      aria-label="Floating sidebar"
    >
      <div className="rounded-2xl border border-black/5 bg-white/80 dark:bg-neutral-900/70 backdrop-blur shadow-lg">
        <div className="p-2 flex items-center justify-between">
          {!collapsed && (
            <span className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Navigation
            </span>
          )}
          <button
            onClick={onCollapseToggle}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-black/5 bg-white/70 dark:bg-neutral-800/70 shadow-sm hover:bg-white/90 dark:hover:bg-neutral-800"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : "rotate-0"}`}
            />
          </button>
        </div>
        <nav className="px-2 pb-2">
          {items.map((it) => {
            const active = pathname === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`group flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-emerald-500 text-white shadow"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                }`}
                title={collapsed ? it.label : undefined}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span className="truncate">{it.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
