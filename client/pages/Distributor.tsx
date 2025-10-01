import AppShell from "@/components/layout/AppShell";
import { DistributionHistory } from "@/components/distributor/DistributionHistory";
import { DistributorComposer } from "@/components/distributor/DistributorComposer";

export default function Distributor() {
  return (
    <AppShell>
      <div className="space-y-8 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Distributor</h1>
          <p className="text-muted-foreground">
            Draft notes, deduplicate them instantly, and send the cleaned lines to the
            teammates who are online.
          </p>
        </header>
        <section aria-label="Distributor composer">
          <DistributorComposer />
        </section>
        <section aria-label="Distribution history">
          <DistributionHistory />
        </section>
      </div>
    </AppShell>
  );
}
