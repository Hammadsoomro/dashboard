import { useMemo } from "react";

import { useDistributor } from "@/hooks/use-distributor";
import { useTeam } from "@/hooks/use-team";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function DistributionHistory() {
  const { distributions } = useDistributor();

  const { members } = useTeam();

  const membersById = useMemo(() => {
    const map = new Map(members.map((member) => [member.id, member]));
    return map;
  }, [members]);

  if (distributions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No distributions yet</CardTitle>
          <CardDescription>
            Prepare lines above, pick teammates, and schedule them to see a
            running history here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {distributions.map((distribution, index) => {
        const createdAt = new Date(distribution.createdAt);
        const createdLabel = Number.isNaN(createdAt.valueOf())
          ? "Just now"
          : formatDistanceToNow(createdAt, { addSuffix: true });

        return (
          <Card key={distribution.id}>
            <CardHeader>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Distribution #{distributions.length - index}
                  </CardTitle>
                  <CardDescription>
                    Scheduled {createdLabel} · {distribution.memberIds.length}{" "}
                    teammate
                    {distribution.memberIds.length === 1 ? "" : "s"}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {distribution.lines.length} line
                    {distribution.lines.length === 1 ? "" : "s"}
                  </Badge>
                  <Badge variant="outline">
                    {distribution.linesPerMember} per teammate
                  </Badge>
                  <Badge variant="outline">
                    every {distribution.intervalSeconds}s
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <LinesList lines={distribution.lines} />
                <AssignmentsList
                  memberIds={distribution.memberIds}
                  assignments={distribution.assignments}
                  membersById={membersById}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function LinesList({
  lines,
}: {
  lines: Array<{ id: string; text: string; wordCount: number }>;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Deduplicated lines
      </h3>
      <div className="overflow-hidden rounded-md border">
        <ScrollArea className="max-h-72">
          <ol className="space-y-3 px-4 py-4 text-sm leading-relaxed">
            {lines.map((line, index) => (
              <li
                key={line.id}
                className="rounded-md border border-border/60 bg-background/70 p-3"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>#{index + 1}</span>
                  <span>{line.wordCount} words</span>
                </div>
                <p className="mt-2 text-foreground" title={line.text}>
                  {line.text}
                </p>
              </li>
            ))}
          </ol>
        </ScrollArea>
      </div>
    </div>
  );
}

function AssignmentsList({
  memberIds,
  assignments,
  membersById,
}: {
  memberIds: string[];
  assignments: Array<{
    memberId: string;
    lines: Array<{ id: string; text: string }>;
  }>;
  membersById: Map<string, import("@/data/team-chat").TeamMember>;
}) {
  const assignmentsByMember = useMemo(() => {
    const map = new Map<string, Array<{ id: string; text: string }>>();
    for (const memberId of memberIds) {
      map.set(memberId, []);
    }
    for (const assignment of assignments) {
      if (!map.has(assignment.memberId)) {
        map.set(assignment.memberId, []);
      }
      const current = map.get(assignment.memberId)!;
      current.push(...assignment.lines);
    }
    return map;
  }, [assignments, memberIds]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Team delivery plan
      </h3>
      <div className="space-y-4 rounded-md border p-4">
        {memberIds.map((memberId) => {
          const member = membersById.get(memberId);
          const lines = assignmentsByMember.get(memberId) ?? [];

          return (
            <div key={memberId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {member?.name ?? "Unnamed teammate"}
                  </p>
                  {member?.role ? (
                    <p className="text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  ) : null}
                </div>
                <Badge variant="secondary">
                  {lines.length} line{lines.length === 1 ? "" : "s"}
                </Badge>
              </div>
              {lines.length === 0 ? (
                <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                  No lines assigned. Adjust the lines per teammate or add more
                  notes above.
                </p>
              ) : (
                <div className="rounded-md border bg-muted/40">
                  {lines.map((line, index) => (
                    <div
                      key={line.id}
                      className={cn(
                        "px-3 py-2 text-xs text-foreground",
                        index !== lines.length - 1 &&
                          "border-b border-border/60",
                      )}
                    >
                      {line.text}
                    </div>
                  ))}
                </div>
              )}
              {memberId !== memberIds[memberIds.length - 1] ? (
                <Separator />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
