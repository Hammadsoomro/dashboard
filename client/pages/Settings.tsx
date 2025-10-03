import AppShell from "@/components/layout/AppShell";

import AppShell from "@/components/layout/AppShell";

export default function Settings() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl text-center py-10">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          General, notifications, appearance, and integrations.
        </p>
      </div>
    </AppShell>
  );
}
