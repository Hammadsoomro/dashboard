import AppShell from "@/components/layout/AppShell";

export default function Dashboard() {
  return (
    <AppShell center>
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {/* New Leads */}
          <section className="rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-6">
            <header className="px-6 pt-5">
              <div className="grid gap-1">
                <div className="text-sm font-semibold">New Leads</div>
                <div className="text-xs text-muted-foreground">Last Month</div>
              </div>
            </header>
            <div className="px-6">
              <div className="aspect-[16/9] min-h-24 flex items-center justify-center">
                <svg className="w-28 h-24" viewBox="0 0 111 96" aria-hidden>
                  <g opacity="0.07" fill="var(--color-background, #000)">
                    <rect x="9" y="5" width="8" height="86" rx="4" />
                    <rect x="26" y="5" width="8" height="86" rx="4" />
                    <rect x="43" y="5" width="8" height="86" rx="4" />
                    <rect x="60" y="5" width="8" height="86" rx="4" />
                    <rect x="77" y="5" width="8" height="86" rx="4" />
                    <rect x="94" y="5" width="8" height="86" rx="4" />
                  </g>
                  <g>
                    <rect x="9" y="44.09" width="8" height="46.91" fill="var(--color-newLeads)" />
                    <rect x="26" y="53.86" width="8" height="37.14" fill="var(--color-newLeads)" />
                    <rect x="43" y="67.55" width="8" height="23.45" fill="var(--color-newLeads)" />
                    <rect x="60" y="51.91" width="8" height="39.09" fill="var(--color-newLeads)" />
                    <rect x="77" y="32.36" width="8" height="58.64" fill="var(--color-newLeads)" />
                    <rect x="94" y="48" width="8" height="43" fill="var(--color-newLeads)" />
                  </g>
                </svg>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
