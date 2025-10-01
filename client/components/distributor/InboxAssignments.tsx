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
import { cn } from "@/lib/utils";
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

        const existing = entries.get(assignment.memberId);
        const payload = {
          distribution,
          assignment,
        };

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
            When the distributor sends lines to teammates, their queue will appear
            here automatically.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {membersWithAssignments.map(({ memberId, member, assignments }) => {
        const totalLines = assignments.reduce((sum, item) => {
          return sum + item.assignment.lines.length;
        }, 0);

        const statusBadge = member?.status ? (
          <Badge variant="outline" className="capitalize">
            {member.status}
          </Badge>
        ) : null;

        return (
          <Card key={memberId}>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  {member?.name ?? "Teammate"}
                </CardTitle>
                <CardDescription>
                  {totalLines} line{totalLines === 1 ? "" : "s"} scheduled across{