import AppShell from "@/components/layout/AppShell";
import { useEffect, useState } from "react";

export default function Settings() {
  const [name, setName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);

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
        setName(data.name || "");
        setAvatarPreview(data.avatarUrl || null);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const onPick = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    try {
      const token = (() => {
        try {
          return localStorage.getItem("token");
        } catch {
          return null;
        }
      })();
      if (!token) {
        alert("Not authenticated");
        setBusy(false);
        return;
      }
      const payload: any = { name };
      if (avatarPreview) payload.avatarUrl = avatarPreview;
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        alert(b.message || "Failed to update");
        setBusy(false);
        return;
      }
      alert("Profile updated");
    } catch (e) {
      console.error(e);
      alert("Unexpected error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl py-10">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile and preferences.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-100">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  No avatar
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">
                Change profile picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onPick(e.target.files?.[0])}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Change password</label>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 mb-2"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={busy}
              type="submit"
              className="rounded-md bg-emerald-500 px-4 py-2 text-white"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem("token");
                } catch {}
                window.location.href = "/login";
              }}
              className="rounded-md border px-4 py-2"
            >
              Logout
            </button>
          </div>
        </form>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Extra features</h2>
          <p className="text-sm text-muted-foreground mt-2">
            You can manage notifications, integrations, and appearance here.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
