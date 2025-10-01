import { useEffect, useState } from "react";
import type { TeamMember } from "@/data/team-chat";

export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/team')
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        if (!mounted) return;
        const mapped = (data || []).map((u: any) => ({
          id: u._id?.$oid ?? (u._id ? String(u._id) : u.email ?? u.id),
          name: u.name,
          role: u.role ?? 'member',
          status: u.status ?? 'online',
          location: u.location ?? '',
          avatarUrl: u.avatarUrl ?? undefined,
        }));
        setMembers(mapped);
      })
      .catch((err) => {
        console.error('Failed to load team members', err);
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return { members, loading };
}
