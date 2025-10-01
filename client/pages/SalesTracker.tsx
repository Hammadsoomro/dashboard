import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useTeam } from "@/hooks/use-team";

type Sales = { userId: string; today: number; weekly: number; monthly: number; tier: string };

const CARD_BG = "https://cdn.builder.io/api/v1/image/assets%2F2fb1fa8beb6843b496f89d80ca484921%2F8a701c1609ab4b7fbaa21dfafa7644b5?format=webp&width=800";

export default function SalesTracker() {
  const { members, loading } = useTeam();
  const [sales, setSales] = useState<Record<string, Sales>>({});
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<Record<string, Partial<Sales>>>({});
  const [isAdmin, setIsAdmin] = useState(false);

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

    // load current user to detect admin for frontend
    (async () => {
      try {
        const token = (() => { try { return localStorage.getItem('token'); } catch { return null; } })();
        if (!token) return;
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        setIsAdmin((data?.role || '').toLowerCase() === 'admin');
      } catch (e) {
        console.error('Failed to fetch current user', e);
      }
    })();
  }, []);

  const tierKeys = [
    'silver',
    'gold',
    'platinum',
    'platinium', // accept alternate spelling if present in data
    'diamond',
    'ruby',
    'sapphire',
  ];

  const tiers = ['Silver','Gold','Platinum','Diamond','Ruby','Sapphire'];

  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tierKeys.forEach((t) => counts[t] = 0);
    // count from sales state and default to silver if missing
    members.forEach((m) => {
      const s = sales[m.id];
      const t = (s?.tier || 'silver').toLowerCase();
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [sales, members]);

  // determine top performer by total sales (today+weekly+monthly)
  const topId = useMemo(() => {
    let bestId: string | null = null;
    let bestScore = -Infinity;
    members.forEach((m) => {
      const s = sales[m.id] ?? { userId: m.id, today: 0, weekly: 0, monthly: 0, tier: 'silver' };
      const score = (s.today || 0) + (s.weekly || 0) + (s.monthly || 0);
      if (score > bestScore) { bestScore = score; bestId = m.id; }
    });
    return bestId;
  }, [sales, members]);

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
            const isTop = topId === m.id;

            return (
              <div key={m.id} className="perspective-1000">
                <div
                  onClick={() => handleFlip(m.id)}
                  className={`relative h-44 w-80 cursor-pointer transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                  {/* FRONT */}
                  <div className={`absolute inset-0 rounded-xl overflow-hidden p-4 backface-visible-hidden shadow-lg ${isTop ? 'ring-2 ring-yellow-400' : ''}`} style={{ backgroundImage: `url(${CARD_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {isTop && (
                      <div className="absolute left-1/2 top-2 -translate-x-1/2 z-20">
                        <svg width="46" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L14.09 8.26L20.97 8.92L15.97 12.97L17.09 19L12 15.77L6.91 19L8.03 12.97L3.03 8.92L9.91 8.26L12 2Z" fill="#F59E0B" />
                        </svg>
                      </div>
                    )}

                    <div className="relative z-10 h-full flex flex-col justify-between text-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm opacity-90">{m.role}</div>
                          <div className="text-lg font-semibold mt-2 drop-shadow">{m.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-90 uppercase tracking-wide">{s.tier}</div>
                          <div className="text-sm font-mono mt-2">**** **** **** 1234</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium bg-black/30 px-3 py-1 rounded-md">Infynno Solutions</div>
                        <div className="text-sm">06/29</div>
                      </div>
                    </div>

                    {/* subtle overlay for non-top */}
                    {!isTop && <div className="absolute inset-0 bg-black/10" />}
                  </div>

                  {/* BACK */}
                  <div className="absolute inset-0 rounded-xl bg-white p-4 text-slate-900 transform rotate-y-180 backface-visible-hidden shadow-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold">Sales</div>
                        {!isEditing ? (
                          <div className="mt-2 text-sm">
                            <div>Today: <span className="font-medium">{s.today}</span></div>
                            <div>Weekly: <span className="font-medium">{s.weekly}</span></div>
                            <div>Monthly: <span className="font-medium">{s.monthly}</span></div>
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
                                {tiers.map(t=> <option key={t} value={t.toLowerCase()}>{t}</option>)}
                              </select>
                            </div>
                          </div>
                        )}

                        <div className="mt-3">
                          <div className="text-xs font-semibold">Team tiers</div>
                          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                            {tiers.map((t) => {
                              const key = t.toLowerCase();
                              const count = tierCounts[key] ?? 0;
                              return (
                                <div key={t} className="flex items-center justify-between px-2 py-1 rounded-md bg-slate-50">
                                  <div className="capitalize">{t}</div>
                                  <div className="font-medium">{count}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {!isEditing ? (
                          isAdmin ? (
                            <button onClick={(e)=>{ e.stopPropagation(); handleEdit(m.id); }} className="text-sm text-amber-600">Edit</button>
                          ) : (
                            <div className="text-xs text-muted-foreground">Admin only</div>
                          )
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
