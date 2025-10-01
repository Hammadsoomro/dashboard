import AppShell from "@/components/layout/AppShell";
import { InboxAssignments } from "@/components/distributor/InboxAssignments";

export default function Inbox() {
  return (
    <AppShell>
      <div className="space-y-8 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">
            Review the lines distributed to each teammate and monitor their delivery cadence.
          </p>
        </header>
        <section aria-label="Distributed lines feed">
          <InboxAssignments />
        </section>
      </div>
    </AppShell>
  );
}
