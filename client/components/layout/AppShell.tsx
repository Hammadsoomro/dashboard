import { ReactNode, useMemo, useState, useEffect } from "react";

import TopNav from "./TopNav";
import Sidebar from "./Sidebar";

const defaultUser = {
  name: "Arham Khan",
  email: "hello@arhamkhnz.com",
  role: "Admin" as const,
};

type AppShellProps = {
  children: ReactNode;
  center?: boolean;
};

export default function AppShell({ children, center = false }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<typeof defaultUser | null>(null);

  const contentWrapperClass = useMemo(
    () => `${center ? "mx-auto max-w-6xl" : "w-full"} px-2 sm:px-4 lg:px-6`,
    [center],
  );

  useEffect(() => {
    let mounted = true;
    const token = (() => {
      try { return localStorage.getItem('token'); } catch { return null; }
    })();
    if (!token) return;
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted) return;
        if (data) {
          setCurrentUser({ name: data.name ?? defaultUser.name, email: data.email ?? defaultUser.email, role: data.role ?? defaultUser.role });
        }
      })
      .catch((err) => console.error('Failed to load current user', err));

    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.9789_0.0082_121.627)] dark:bg-neutral-950">
      <div className="mx-auto flex min-h-screen max-w-[1440px] items-start gap-6 px-4 pb-6 pt-4 sm:pt-6">
        <Sidebar
          collapsed={collapsed}
          onCollapseToggle={() => setCollapsed((state) => !state)}
          user={currentUser ?? defaultUser}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto py-6">
            <div className={`${contentWrapperClass} h-full`}>{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
