import AppShell from "@/components/layout/AppShell";
import { useEffect, useState } from "react";
import { useTeam } from "@/hooks/use-team";

export default function TeamManagement() {
  const { members, loading } = useTeam();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    window.location.reload();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const token = (() => { try { return localStorage.getItem('token'); } catch { return null; } })();
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ name, email, password, role: isAdmin ? 'admin' : 'member' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 401) {
          alert('Not authenticated. Please login and try again.');
        } else if (res.status === 403) {
          alert('Forbidden. You must be an admin to create team members.');
        } else {
          alert(body?.message || 'Failed to create user');
        }
        setBusy(false);
        return;
      }
      setName(''); setEmail(''); setPassword(''); setIsAdmin(false);
      refresh();
    } catch (e) {
      console.error(e);
      alert('Unexpected error');
    } finally { setBusy(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    setBusy(true);
    try {
      const token = (() => { try { return localStorage.getItem('token'); } catch { return null; } })();
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE', headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
      if (!res.ok) {
        alert('Failed to delete');
      }
      refresh();
    } catch (e) { console.error(e); alert('Error'); }
    finally { setBusy(false); }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl py-10">
        <h1 className="text-2xl font-semibold">Team Management</h1>
        <p className="text-muted-foreground mt-2">Create and manage team members.</p>

        <form onSubmit={handleCreate} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <input id="isAdmin" type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
            <label htmlFor="isAdmin" className="text-sm">Make admin</label>
          </div>
          <div className="sm:col-span-2">
            <button disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-white">Create new team member</button>
          </div>
        </form>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Team members</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-md border px-4 py-3">
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-md border">{m.role}</span>
                    <button onClick={() => handleDelete(m.id)} disabled={busy} className="text-sm text-red-600">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
