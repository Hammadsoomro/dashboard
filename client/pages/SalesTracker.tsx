import AppShell from "@/components/layout/AppShell";
import { useEffect, useState } from "react";
import { useTeam } from "@/hooks/use-team";

type Sales = { userId: string; today: number; weekly: number; monthly: number; tier: string };

export default function SalesTracker() {
  const { members, loading } = useTeam();
  const [sales, setSales] = useState<Record<string, Sales>>({});
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<Record<string, Partial<Sales>>>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/sales');
        if (!res.ok) return;
        const data: Sales[] = await res.json();
        const map: Record<string, Sales> = {};
        data.forEach((s) => { map[s.userId] = s; });
        setSales(map);
      } catch (e) {
        console.error('Failed to load sales', e);
      }
    }
    load();
  }, []);

  const tiers = ['silver','gold','platinium','diamond','ruby','sapphire'];

  const handleFlip = (id: string) => setFlipped((s) => ({ ...s, [id]: !s[id] }));

  const handleEdit = (id: string) => {
    setEditing((e) => ({ ...e, [id]: !e[id] }));
    setForm((f) => ({ ...f, [id]: sales[id] ? { ...sales[id] } : { userId: id, today:0,weekly:0,monthly:0,tier:'silver' } }));
  };

  const handleChange = (id: string, key: keyof Sales, value: any) => {
    setForm((f) => ({ ...f, [id]: { ...(f[id] || {}), [key]: value } }));
  };

  const save = async (id: string) => {
    const payload = form[id];
    try {
      const token = (() => { try { return localStorage.getItem('token'); } catch { return null; } })();
      const res = await fetch(`/api/sales/${id}`, { method: 'POST', headers: { 'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}) }, body: JSON.stringify(payload) });
      if (!res.ok) { const b = await res.json().catch(()=>({})); alert(b.message||'Failed'); return; }
      const saved = await res.json();
      setSales((s) => ({ ...s, [id]: saved }));
      setEditing((e) => ({ ...e, [id]: false }));
    } catch (e) { console.error(e); alert('Error'); }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl py-10">
        <h1 className="text-2xl font-semibold">Sales Tracker</h1>
        <p className="text-muted-foreground mt-2">Click a card to flip and view/edit sales metrics.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => {
            const s = sales[m.id] ?? { userId: m.id, today: 0, weekly: 0, monthly: 0, tier: 'silver' };
            const isFlipped = !!flipped[m.id];
            const isEditing = !!editing[m.id];
            return (
              <div key={m.id} className="perspective-1000">
                <div
                  onClick={() => handleFlip(m.id)}
                  className={`relative h-44 w-80 cursor-pointer transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white p-4 backface-visible-hidden">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm opacity-80">{m.role}</div>
                        <div className="text-lg font-semibold mt-2">{m.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-80">{s.tier}</div>
                        <div className="text-sm font-mono">**** **** **** 1234</div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-sm">Team member</div>
                  </div>

                  <div className="absolute inset-0 rounded-xl bg-white p-4 text-slate-900 transform rotate-y-180 backface-visible-hidden">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">Sales</div>
                        {!isEditing ? (
                          <div className="mt-2 text-sm">
                            <div>Today: {s.today}</div>
                            <div>Weekly: {s.weekly}</div>
                            <div>Monthly: {s.monthly}</div>
                          </div>
                        ) : (
                          <div className="mt-2 space-y-2">
                            <div>
                              <label className="text-xs">Today</label>
                              <input type="number" value={(form[m.id]?.today ?? s.today) as any} onChange={(e)=>handleChange(m.id,'today',Number(e.target.value))} className="mt-1 w-full rounded-md border px-2 py-1" />
                            </div>
                            <div>
                              <label className="text-xs">Weekly</label>
                              <input type="number" value={(form[m.id]?.weekly ?? s.weekly) as any} onChange={(e)=>handleChange(m.id,'weekly',Number(e.target.value))} className="mt-1 w-full rounded-md border px-2 py-1" />
                            </div>
                            <div>
                              <label className="text-xs">Monthly</label>
                              <input type="number" value={(form[m.id]?.monthly ?? s.monthly) as any} onChange={(e)=>handleChange(m.id,'monthly',Number(e.target.value))} className="mt-1 w-full rounded-md border px-2 py-1" />
                            </div>
                            <div>
                              <label className="text-xs">Tier</label>
                              <select value={(form[m.id]?.tier ?? s.tier) as any} onChange={(e)=>handleChange(m.id,'tier',e.target.value)} className="mt-1 w-full rounded-md border px-2 py-1">
                                {tiers.map(t=> <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {!isEditing ? (
                          <button onClick={(e)=>{ e.stopPropagation(); handleEdit(m.id); }} className="text-sm text-amber-600">Edit</button>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <button onClick={(e)=>{ e.stopPropagation(); save(m.id); }} className="text-sm bg-amber-500 text-white px-3 py-1 rounded-md">Save</button>
                            <button onClick={(e)=>{ e.stopPropagation(); setEditing((x)=>({ ...x, [m.id]: false })); }} className="text-sm text-muted-foreground">Cancel</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
