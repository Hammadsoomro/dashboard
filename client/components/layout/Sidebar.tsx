import {
  ChevronLeft,
  Command,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Mail,
  MessageSquareMore,
  ShoppingBag,
  Truck,
  Users2,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  to?: string;
  status?: "soon";
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

export default function Sidebar({ collapsed, onCollapseToggle, user }: SidebarProps) {
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
        title: "Dashboards",
        items: [
          { label: "Default", icon: LayoutDashboard, to: "/dashboard" },
          { label: "CRM", icon: Users2, to: "/team-management" },
          { label: "Finance", icon: Wallet, to: "/sales-tracker" },
          { label: "Analytics", icon: LineChart, status: "soon" },
          { label: "E-commerce", icon: ShoppingBag, status: "soon" },
          { label: "Academy", icon: GraduationCap, status: "soon" },
          { label: "Logistics", icon: Truck, status: "soon" },
        ],
      },
      {
        title: "Pages",
        items: [
          { label: "Email", icon: Mail, to: "/inbox" },
          { label: "Chat", icon: MessageSquareMore, status: "soon" },
        ],
      },
    ],
    [],
  );

  return (
    <aside
      className={cn(
        "shrink-0 transition-[width] duration-300",
        collapsed ? "w-24" : "w-72",
      )}
      aria-label="Sidebar navigation"
    >
      <div className="flex h-full flex-col rounded-3xl border border-black/5 bg-white/80 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-neutral-900/70">
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

        <Link
          to="/dashboard"
          className={cn(
            "group mb-6 flex items-center gap-3 rounded-2xl bg-[oklch(0.627_0.228_85.852)] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110",
            collapsed && "justify-center px-3",
          )}
          aria-label="Quick Create"
        >
          <div className="flex items-center gap-2">
            <Command className="h-4 w-4" />
            {!collapsed && <span>Quick Create</span>}
          </div>
          {!collapsed && (
            <span className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Mail className="h-4 w-4" />
            </span>
          )}
        </Link>

        <nav className="flex-1 space-y-6 overflow-y-auto pb-4">
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
                  const isActive = Boolean(item.to && pathname === item.to);
                  const isDisabled = item.status === "soon";
                  const content = (
                    <div
                      aria-disabled={isDisabled || undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                        collapsed ? "justify-center" : "",
                        isDisabled
                          ? "cursor-default text-neutral-400 dark:text-neutral-600"
                          : "text-neutral-600 hover:bg-black/5 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white",
                        isActive &&
                          "bg-amber-500 text-white shadow hover:bg-amber-500 dark:hover:bg-amber-500",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate font-medium">{item.label}</span>
                          {item.status === "soon" && (
                            <Badge
                              variant="secondary"
                              className="ml-auto bg-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300"
                            >
                              Soon
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  );

                  if (!item.to || isDisabled) {
                    return (
                      <div
                        key={item.label}
                        className="pointer-events-none"
                        title={collapsed ? item.label : undefined}
                      >
                        {content}
                      </div>
                    );
                  }

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

        <div className="mt-auto rounded-2xl border border-black/5 bg-white/70 p-3 dark:border-white/10 dark:bg-neutral-800/60">
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
