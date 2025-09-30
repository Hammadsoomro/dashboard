import TopNav from "@/components/layout/TopNav";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, UsersRound, Sparkles } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-[oklch(0.9789_0.0082_121.627)] dark:bg-neutral-950">
      <TopNav />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_200px_at_10%_20%,rgba(16,185,129,0.25),transparent),radial-gradient(400px_150px_at_80%_10%,rgba(56,189,248,0.25),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs font-medium shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> Web Preset: Soft Pop
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl/tight font-extrabold tracking-tight text-neutral-900 dark:text-white">
                A beautiful CRM dashboard for modern teams
              </h1>
              <p className="mt-4 text-neutral-600 dark:text-neutral-300 max-w-prose">
                Track leads, proposals, revenue and more. Floating, collapsible sidebar. Sticky navbar. Light and Dark modes. Built with performance and polish.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-white px-5 py-3 shadow hover:bg-emerald-600"
                >
                  View Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-xl border border-black/5 bg-white px-5 py-3 text-neutral-800 shadow-sm hover:bg-white/90"
                >
                  Register / Login
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-300">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure</div>
                <div className="flex items-center gap-2"><UsersRound className="h-4 w-4 text-sky-500" /> Team-first</div>
                <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" /> Polished UI</div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-black/5 bg-white shadow-xl p-4 md:p-6">
                <img
                  alt="Dashboard preview"
                  className="rounded-2xl w-full object-cover"
                  src="https://images.unsplash.com/photo-1556767576-cfba2c112a41?q=80&w=2067&auto=format&fit=crop"
                />
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-emerald-50 text-emerald-700 px-3 py-2 text-sm font-semibold">+54.6% Leads</div>
                  <div className="rounded-xl bg-sky-50 text-sky-700 px-3 py-2 text-sm font-semibold">+35% YTD</div>
                  <div className="rounded-xl bg-amber-50 text-amber-700 px-3 py-2 text-sm font-semibold">78% Target</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Team Members</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {["Hammad","Ayesha","Bilal","Zain","Noor"].map((n,i)=> (
              <div key={i} className="rounded-2xl border border-black/5 bg-white/80 backdrop-blur p-4 shadow">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-400 ring-1 ring-black/5" />
                <div className="mt-3 font-medium">{n}</div>
                <div className="text-xs text-muted-foreground">Product Team</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
