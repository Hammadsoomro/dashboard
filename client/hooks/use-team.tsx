import { useEffect, useState } from "react";
import type { TeamMember } from "@/data/team-chat";

export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const urls = [
      '/api/team',
      `${origin}/api/team`,
      `${origin.replace(/^https?:\/\//, 'https://')}/api/team`,
    ];

    let aborted = false;

    const tryFetch = async () => {
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        try {
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) {
            const text = await res.text().catch(() => '<no-body>');
            console.error(`useTeam: fetch ${url} returned ${res.status}`, text);
            continue;
          }
          const data = await res.json();
          if (!mounted || aborted) return;
          const mapped = (data || []).map((u: any) => ({
            id: u._id?.$oid ?? (u._id ? String(u._id) : u.email ?? u.id),
            name: u.name,
            role: u.role ?? 'member',
            status: u.status ?? 'online',
            location: u.location ?? '',
            avatarUrl: u.avatarUrl ?? undefined,
          }));
          setMembers(mapped);
          setLoading(false);
          return;
        } catch (err) {
          console.error(`useTeam: fetch ${url} failed`, err);
          // try next url
        }
      }

      if (!aborted) {
        console.error('useTeam: all fetch attempts failed');
        setLoading(false);
      }
    };

    tryFetch();

    return () => {
      mounted = false;
      aborted = true;
    };
  }, []);

  return { members, loading };
}
