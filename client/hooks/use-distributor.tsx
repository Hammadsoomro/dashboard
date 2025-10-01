import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface DistributionLine {
  id: string;
  text: string;
  preview: string;
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
  }) => DistributionRecord;
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

  const addDistribution = useCallback<DistributorContextValue["addDistribution"]>(
    ({ lines, linesPerMember, intervalSeconds, memberIds }) => {
      const createdAt = new Date().toISOString();
      const assignments = buildAssignments(lines, memberIds, linesPerMember);
      const record: DistributionRecord = {
        id: generateId("distribution"),
        createdAt,
        lines,
        linesPerMember,
        intervalSeconds,
        memberIds,
        assignments,
      };

      setDistributions((current) => [record, ...current]);
      return record;
    },
  );

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
