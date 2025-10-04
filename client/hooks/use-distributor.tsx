import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

export interface DistributionLine {
  id: string;
  text: string;
  preview: string;
  wordCount: number;
}

export interface DistributionAssignment {
  memberId: string;
  lines: DistributionLine[];
}

export interface DistributionRecord {
  id: string;
  createdAt: string;
  lines: DistributionLine[];
  linesPerMember: number;
  intervalSeconds: number;
  memberIds: string[];
  assignments: DistributionAssignment[];
}

interface DistributorContextValue {
  distributions: DistributionRecord[];
  addDistribution: (payload: {
    lines: DistributionLine[];
    linesPerMember: number;
    intervalSeconds: number;
    memberIds: string[];
  }) => Promise<DistributionRecord>;
  clearDistributions: () => void;
}

const DistributorContext = createContext<DistributorContextValue | null>(null);

function generateId(prefix: string) {
  const base =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  return `${prefix}-${base}`;
}

function buildAssignments(
  lines: DistributionLine[],
  memberIds: string[],
  linesPerMember: number,
): DistributionAssignment[] {
  if (!lines.length || !memberIds.length || linesPerMember <= 0) {
    return [];
  }

  const assignments = memberIds.map<DistributionAssignment>((memberId) => ({
    memberId,
    lines: [],
  }));

  let pointer = 0;
  while (pointer < lines.length) {
    for (const assignment of assignments) {
      if (pointer >= lines.length) {
        break;
      }

      const chunk = lines.slice(pointer, pointer + linesPerMember);
      pointer += chunk.length;

      if (chunk.length) {
        assignment.lines = assignment.lines.concat(chunk);
      }
    }
  }

  return assignments.filter((assignment) => assignment.lines.length > 0);
}

export function DistributorProvider({ children }: { children: ReactNode }) {
  const [distributions, setDistributions] = useState<DistributionRecord[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // load current user
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
        setCurrentUserId(
          data._id?.$oid ??
            (data._id ? String(data._id) : (data.id ?? data.email)),
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const fetchDistributions = useCallback(async () => {
    try {
      const token = (() => {
        try {
          return localStorage.getItem("token");
        } catch {
          return null;
        }
      })();
      if (!token) return;
      const res = await fetch("/api/distributions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data: any[] = await res.json();
      setDistributions(
        data.map((d: any) => ({
          id: d._id?.$oid ?? (d._id ? String(d._id) : d.id),
          createdAt: d.createdAt,
          lines: d.items ?? d.lines ?? [],
          linesPerMember: d.linesPerMember ?? 1,
          intervalSeconds: d.intervalSeconds ?? 1,
          memberIds: d.assignments
            ? d.assignments.map((a: any) => a.memberId)
            : d.memberIds || [],
          assignments:
            d.assignments?.map((a: any) => ({
              memberId: a.memberId,
              lines: a.lines,
            })) || [],
        })),
      );

      // notify current user for new assignments
      const userId = currentUserId;
      if (!userId) return;

      const key = `readDistributions:${userId}`;
      const seen = new Set<string>(
        JSON.parse(localStorage.getItem(key) || "[]"),
      );

      for (const d of data) {
        const id = d._id?.$oid ?? (d._id ? String(d._id) : d.id);
        if (seen.has(id)) continue;
        // check if current user has assignment
        const assignments = d.assignments || [];
        const match = assignments.find(
          (a: any) => String(a.memberId) === String(userId),
        );
        if (match && match.lines && match.lines.length) {
          // show notification
          try {
            if (
              typeof Notification !== "undefined" &&
              Notification.permission === "granted"
            ) {
              new Notification("New lines received", {
                body: `${match.lines.length} new line${match.lines.length === 1 ? "" : "s"} assigned`,
              });
            } else if (
              typeof Notification !== "undefined" &&
              Notification.permission !== "denied"
            ) {
              Notification.requestPermission().then((perm) => {
                if (perm === "granted")
                  new Notification("New lines received", {
                    body: `${match.lines.length} new line${match.lines.length === 1 ? "" : "s"} assigned`,
                  });
              });
            }
          } catch (e) {
            console.error("Notification failed", e);
          }

          // play sound via WebAudio API
          try {
            if (typeof window !== "undefined" && "AudioContext" in window) {
              const ac = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
              const o = ac.createOscillator();
              const g = ac.createGain();
              o.type = "sine";
              o.frequency.value = 880;
              g.gain.value = 0.1;
              o.connect(g);
              g.connect(ac.destination);
              o.start();
              setTimeout(() => {
                o.stop();
                try {
                  ac.close();
                } catch {}
              }, 600);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    } catch (e) {
      console.error("Failed fetching distributions", e);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchDistributions();
    const t = setInterval(fetchDistributions, 5000);
    return () => clearInterval(t);
  }, [fetchDistributions]);

  const addDistribution = useCallback<
    DistributorContextValue["addDistribution"]
  >(async ({ lines, linesPerMember, intervalSeconds, memberIds }) => {
    // POST to server
    try {
      const token = (() => {
        try {
          return localStorage.getItem("token");
        } catch {
          return null;
        }
      })();
      if (!token) throw new Error("Not authenticated");
      const payload = {
        title: "Distribution",
        items: lines,
        linesPerMember,
        intervalSeconds,
        assignees: memberIds,
      } as any;
      const res = await fetch("/api/distributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.message || "Failed to create");
      }
      const created = await res.json();
      // map server doc to DistributionRecord
      const record: DistributionRecord = {
        id:
          created._id?.$oid ?? (created._id ? String(created._id) : created.id),
        createdAt: created.createdAt,
        lines: created.items ?? created.lines ?? [],
        linesPerMember: created.linesPerMember ?? linesPerMember,
        intervalSeconds: created.intervalSeconds ?? intervalSeconds,
        memberIds: created.assignments
          ? created.assignments.map((a: any) => a.memberId)
          : created.memberIds || [],
        assignments:
          created.assignments?.map((a: any) => ({
            memberId: a.memberId,
            lines: a.lines,
          })) || [],
      };
      setDistributions((cur) => [record, ...cur]);
      return record;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, []);

  const clearDistributions = useCallback(() => {
    setDistributions([]);
  }, []);

  const value = useMemo(
    () => ({ distributions, addDistribution, clearDistributions }),
    [distributions, addDistribution, clearDistributions],
  );

  return (
    <DistributorContext.Provider value={value}>
      {children}
    </DistributorContext.Provider>
  );
}

export function useDistributor() {
  const context = useContext(DistributorContext);
  if (!context) {
    throw new Error("useDistributor must be used within DistributorProvider");
  }
  return context;
}
