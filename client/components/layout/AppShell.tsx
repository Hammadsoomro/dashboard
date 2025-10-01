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

  const contentWrapperClass = useMemo(
    () => `${center ? "mx-auto max-w-6xl" : "w-full"} px-2 sm:px-4 lg:px-6`,
    [center],
  );

  return (
    <div className="min-h-screen bg-[oklch(0.9789_0.0082_121.627)] dark:bg-neutral-950">
      <div className="mx-auto flex min-h-screen max-w-[1440px] items-start gap-6 px-4 pb-6 pt-4 sm:pt-6">
        <Sidebar
          collapsed={collapsed}
          onCollapseToggle={() => setCollapsed((state) => !state)}
          user={defaultUser}
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
