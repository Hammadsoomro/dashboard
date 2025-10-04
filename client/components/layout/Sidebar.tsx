import {
  ChevronLeft,
  Command,
  LayoutDashboard,
  LineChart,
  Mail,
  MessageSquareMore,
  Settings,
  Truck,
  Users2,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type SidebarUser = {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
};

type SidebarNavItem = {
  label: string;
  icon: LucideIcon;
  to: string;
};

type SidebarSection = {
  title: string;
  items: SidebarNavItem[];
};

type SidebarProps = {
  collapsed: boolean;
  onCollapseToggle: () => void;
  user: SidebarUser;
};

export default function Sidebar({
  collapsed,
  onCollapseToggle,
  user,
}: SidebarProps) {
  const { pathname } = useLocation();

  const initials = useMemo(() => {
    const letters = user.name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0] ?? "")
      .join("");
    return letters.slice(0, 2).toUpperCase() || "U";
  }, [user.name]);

  const sections = useMemo<SidebarSection[]>(
    () => [
      {
        title: "Menu",
        items: [
          { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
          { label: "Team Chat", icon: MessageSquareMore, to: "/team-chat" },
          { label: "Inbox", icon: Mail, to: "/inbox" },
          // Distributor only visible to admins
          ...(user.role && (user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'super-admin') ? [{ label: "Distributor", icon: Truck, to: "/distributor" }] : []),
          { label: "Sales Tracker", icon: LineChart, to: "/sales-tracker" },
          { label: "Team Management", icon: Users2, to: "/team-management" },
          { label: "Setting", icon: Settings, to: "/settings" },
        ],
      },
    ],
    [user.role],
  );

  // Live time display
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  const dateString = now.toLocaleDateString();

  return (
    <aside
      className={cn(
        "sticky top-4 shrink-0 self-start transition-[width] duration-300",
        collapsed ? "w-24" : "w-72",
      )}
      aria-label="Sidebar navigation"
    >
      <div className="flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-3xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <div className="flex items-center gap-3 pb-4">
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                Role
              </p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                {user.role}
              </p>
            </div>
          )}
          <button
            onClick={onCollapseToggle}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-black/5 bg-white/70 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-neutral-800/70 dark:hover:bg-neutral-800"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed ? "rotate-180" : "rotate-0",
              )}
            />
          </button>
        </div>

        <div className={cn("mb-6 flex w-full items-center rounded-2xl px-4 py-3 transition", collapsed ? "justify-center" : "bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 text-white")}>
          {!collapsed ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/20 p-2 text-white">
                  <Command className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Live time</span>
                  <span className="text-xs opacity-90">{dateString}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-semibold">{timeString}</div>
                <div className="text-xs opacity-80">Local time</div>
              </div>
            </div>
          ) : (
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-sky-400 to-indigo-500 text-white">
              <div className="text-xs font-mono">{now.getHours().toString().padStart(2,'0')}:{now.getMinutes().toString().padStart(2,'0')}</div>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto pb-4 pr-1">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              {!collapsed && (
                <p className="px-1 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.to;
                  const isInbox = item.to === '/inbox';
                  const content = (
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-neutral-600 transition hover:bg-black/5 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white",
                        collapsed ? "justify-center" : "",
                        isActive &&
                          "bg-amber-500 text-white shadow hover:bg-amber-500 dark:hover:bg-amber-500",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {!collapsed && (
                        <span className="flex-1 truncate font-medium">
                          {item.label}
                        </span>
                      )}

                      {!collapsed && isInbox && (
                        <span className="inline-flex items-center justify-center rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
                          {/* placeholder for unread count; updated below via DOM mutation */}
                          {''}
                        </span>
                      )}
                    </div>
                  );

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-black/5 bg-white/90 p-3 dark:border-white/10 dark:bg-neutral-800/60">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-emerald-400 via-sky-400 to-indigo-500 text-sm font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {user.name}
                </p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
