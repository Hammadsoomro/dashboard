import AppShell from "@/components/layout/AppShell";
import { useEffect, useState } from "react";
import { DistributionHistory } from "@/components/distributor/DistributionHistory";
import { DistributorComposer } from "@/components/distributor/DistributorComposer";

export default function Distributor() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const token = (() => {
          try {
            return localStorage.getItem("token");
          } catch {
            return null;
          }
        })();
        if (!token) return;
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setIsAdmin(
          (data?.role || "").toLowerCase() === "admin" ||
            (data?.role || "").toLowerCase() === "super-admin",
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <AppShell>
      <div className="space-y-8 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Distributor</h1>
          <p className="text-muted-foreground">
            Draft notes, deduplicate them instantly, and send the cleaned lines
            to the teammates who are online.
          </p>
        </header>
        <section aria-label="Distributor composer">
          {isAdmin ? (
            <DistributorComposer />
          ) : (
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              Only team admins can create distributions.
            </div>
          )}
        </section>
        <section aria-label="Distribution history">
          <DistributionHistory />
        </section>
      </div>
    </AppShell>
  );
}
