import { useMemo } from "react";

import { teamChatData, type TeamMember } from "@/data/team-chat";
import {
  type DistributionAssignment,
  type DistributionRecord,
  useDistributor,
} from "@/hooks/use-distributor";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface MemberInboxItem {
  memberId: string;
  member: TeamMember | undefined;
  assignments: Array<{
    distribution: DistributionRecord;
    assignment: DistributionAssignment;
  }>;
}

export function InboxAssignments() {
  const { distributions } = useDistributor();

  const memberMap = useMemo(
    () => new Map(teamChatData.members.map((member) => [member.id, member])),
    [],
  );

  const membersWithAssignments = useMemo<MemberInboxItem[]>(() => {
    const entries = new Map<string, MemberInboxItem>();

    for (const distribution of distributions) {
      for (const assignment of distribution.assignments) {
        if (assignment.lines.length === 0) {
          continue;
        }

        const payload = { distribution, assignment };
        const existing = entries.get(assignment.memberId);

        if (existing) {
          existing.assignments.push(payload);
        } else {
          entries.set(assignment.memberId, {
            memberId: assignment.memberId,
            member: memberMap.get(assignment.memberId),
            assignments: [payload],
          });
        }
      }
    }

    const sorted = Array.from(entries.values()).map((entry) => {
      entry.assignments.sort((a, b) => {
        const aTime = new Date(a.distribution.createdAt).valueOf();
        const bTime = new Date(b.distribution.createdAt).valueOf();
        return bTime - aTime;
      });
      return entry;
    });

    sorted.sort((a, b) => {
      const nameA = a.member?.name ?? "";
      const nameB = b.member?.name ?? "";
      return nameA.localeCompare(nameB);
    });

    return sorted;
  }, [distributions, memberMap]);

  if (membersWithAssignments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No lines distributed yet</CardTitle>
          <CardDescription>
            When the distributor sends lines to teammates, their queue will
            appear here automatically.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {membersWithAssignments.map(({ memberId, member, assignments }) => {
        const totalLines = assignments.reduce(
          (sum, item) => sum + item.assignment.lines.length,
          0,
        );

        return (
          <Card key={memberId}>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  {member?.name ?? "Teammate"}
                </CardTitle>
                <CardDescription>
                  {totalLines} line{totalLines === 1 ? "" : "s"} scheduled
                  across {assignments.length} batch
                  {assignments.length === 1 ? "" : "es"}.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {member?.role ? (
                  <Badge variant="secondary">{member.role}</Badge>
                ) : null}
                {member?.status ? (
                  <Badge variant="outline" className="capitalize">
                    {member.status}
                  </Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map(({ distribution, assignment }) => {
                  const createdAt = new Date(distribution.createdAt);
                  const createdLabel = Number.isNaN(createdAt.valueOf())
                    ? "just now"
                    : formatDistanceToNow(createdAt, { addSuffix: true });

                  return (
                    <div
                      key={`${distribution.id}-${assignment.memberId}`}
                      className="rounded-lg border bg-muted/40 p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm font-semibold text-foreground">
                          Distribution {createdLabel}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">
                            {assignment.lines.length} line
                            {assignment.lines.length === 1 ? "" : "s"}
                          </Badge>
                          <Badge variant="outline">
                            every {distribution.intervalSeconds}s
                          </Badge>
                        </div>
                      </div>
                      <ScrollArea className="mt-3 max-h-48 rounded-md border bg-background">
                        <ol className="divide-y text-sm">
                          {assignment.lines.map((line, index) => (
                            <li key={line.id} className="space-y-1 px-4 py-3">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Line {index + 1}</span>
                                <span>
                                  {index * distribution.intervalSeconds}s mark
                                </span>
                              </div>
                              <p className="text-foreground">{line.text}</p>
                            </li>
                          ))}
                        </ol>
                      </ScrollArea>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
