import AppShell from "@/components/layout/AppShell";

export default function SalesTracker() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl text-center py-10">
        <h1 className="text-2xl font-semibold">Sales Tracker</h1>
        <p className="text-muted-foreground mt-2">We can add charts, KPIs, and pipelines here. Share specifics.</p>
      </div>
    </AppShell>
  );
}
