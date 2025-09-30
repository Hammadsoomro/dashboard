import { ReactNode, useMemo, useState } from "react";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";

export default function AppShell({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const contentWrapperClass = useMemo(
    () => `${center ? "mx-auto max-w-6xl" : "w-full"} px-2 sm:px-4 lg:px-6`,
    [center],
  );

  const sidebarOffset = collapsed ? 80 : 256;

  return (
    <div className="min-h-screen bg-[oklch(0.9789_0.0082_121.627)] dark:bg-neutral-950">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-6 px-4 py-6">
        <Sidebar
          collapsed={collapsed}
          onCollapseToggle={() => setCollapsed((state) => !state)}
        />
        <div className="flex flex-1 flex-col">
          <TopNav sidebarOffset={sidebarOffset} />
          <main className="flex-1 pt-6 pb-10">
            <div className={contentWrapperClass}>{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
