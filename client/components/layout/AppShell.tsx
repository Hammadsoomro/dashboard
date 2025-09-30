import { ReactNode, useState } from "react";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";

export default function AppShell({ children, center = false }: { children: ReactNode; center?: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <TopNav showSidebarToggle onToggleSidebar={() => setSidebarOpen((s) => !s)} />
      <Sidebar collapsed={!sidebarOpen} onCollapseToggle={() => setSidebarOpen((s) => !s)} />
      <main className={`pt-6 ${center ? "" : ""}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
