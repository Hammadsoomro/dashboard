import { useMemo, useState } from "react";

import type { TeamMember } from "@/data/team-chat";
import { useTeam } from "@/hooks/use-team";
import { type DistributionLine, useDistributor } from "@/hooks/use-distributor";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const LINES_PER_MEMBER_OPTIONS = [1, 3, 5, 10, 15, 20];
const INTERVAL_OPTIONS = [1, 3, 5, 10, 30, 50, 120, 150, 200];

export function DistributorComposer() {
  const { addDistribution } = useDistributor();
  const { toast } = useToast();

  const [inputValue, setInputValue] = useState("");
  const { members } = useTeam();
  const onlineMembers = useMemo(
    () => members.filter((member) => member.status === "online"),
    [members],
  );
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(() =>
    onlineMembers.map((member) => member.id),
  );
  const [linesPerMember, setLinesPerMember] = useState<number>(
    LINES_PER_MEMBER_OPTIONS[1],
  );
  const [intervalIndex, setIntervalIndex] = useState(3);

  const dedupedLines = useMemo<DistributionLine[]>(
    () => buildDedupedLines(inputValue),
    [inputValue],
  );

  const intervalSeconds =
    INTERVAL_OPTIONS[intervalIndex] ?? INTERVAL_OPTIONS[0];

  const handleMemberToggle = (memberId: string) => {
    setSelectedMemberIds((current) => {
      if (current.includes(memberId)) {
        return current.filter((id) => id !== memberId);
      }
      return [...current, memberId];
    });
  };

  const handleSubmit = async () => {
    if (!dedupedLines.length || !selectedMemberIds.length) {
      return;
    }

    try {
      const record = await addDistribution({
        lines: dedupedLines,
        linesPerMember,
        intervalSeconds,
        memberIds: selectedMemberIds,
      });

      toast({
        title: "Distribution scheduled",
        description: `${record.lines.length} unique lines will start rolling out every ${record.intervalSeconds} seconds.`,
      });

      setInputValue("");
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Failed to schedule distribution",
        description: e?.message || String(e),
      });
    }
  };

  const isSubmitDisabled =
    dedupedLines.length === 0 || selectedMemberIds.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line distributor</CardTitle>
        <CardDescription>
          Type or paste notes on the left. We will deduplicate them line by line
          and only keep the first 15 words for the live preview.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="distributor-input"
                className="text-sm font-medium"
              >
                Notepad input
              </Label>
              <Badge variant="secondary">{dedupedLines.length} unique</Badge>
            </div>
            <Textarea
              id="distributor-input"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Add one idea per line..."
              spellCheck={false}
              className="min-h-[280px] font-mono"
            />
          </div>
          <DistributionPreview lines={dedupedLines} />
        </div>

        <DistributionSettings
          linesPerMember={linesPerMember}
          onLinesPerMemberChange={setLinesPerMember}
          intervalIndex={intervalIndex}
          onIntervalChange={setIntervalIndex}
          selectedMemberIds={selectedMemberIds}
          onToggleMember={handleMemberToggle}
          intervalSeconds={intervalSeconds}
          onlineMembers={onlineMembers}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Sending {linesPerMember} line{linesPerMember === 1 ? "" : "s"} per
          teammate every {intervalSeconds} second
          {intervalSeconds === 1 ? "" : "s"}.
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
          Add to distributor
        </Button>
      </CardFooter>
    </Card>
  );
}

interface DistributionSettingsProps {
  linesPerMember: number;
  onLinesPerMemberChange: (value: number) => void;
  intervalIndex: number;
  onIntervalChange: (value: number) => void;
  selectedMemberIds: string[];
  onToggleMember: (memberId: string) => void;
  intervalSeconds: number;
  onlineMembers: TeamMember[];
}

function DistributionSettings({
  linesPerMember,
  onLinesPerMemberChange,
  intervalIndex,
  onIntervalChange,
  selectedMemberIds,
  onToggleMember,
  intervalSeconds,
  onlineMembers,
}: DistributionSettingsProps) {
  const memberCount = onlineMembers.length;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium" htmlFor="lines-per-member">
            Lines per teammate
          </Label>
          <Select
            value={String(linesPerMember)}
            onValueChange={(value) => onLinesPerMemberChange(Number(value))}
          >
            <SelectTrigger id="lines-per-member">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LINES_PER_MEMBER_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option} line{option === 1 ? "" : "s"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              className="text-sm font-medium"
              htmlFor="distribution-interval"
            >
              Send cadence
            </Label>
            <Badge variant="outline">{intervalSeconds} sec</Badge>
          </div>
          <Slider
            id="distribution-interval"
            aria-label="Distribution interval"
            value={[intervalIndex]}
            min={0}
            max={INTERVAL_OPTIONS.length - 1}
            step={1}
            onValueChange={(value) => {
              const next = value[0] ?? 0;
              onIntervalChange(next);
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {INTERVAL_OPTIONS.map((option, index) => (
              <span
                key={option}
                className={cn(
                  "min-w-[2.5rem] text-center font-medium",
                  index === intervalIndex
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {option}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Online teammates</Label>
          <Badge variant="secondary">
            {selectedMemberIds.length}/{memberCount}
          </Badge>
        </div>

        {memberCount === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            No teammates are online right now.
          </div>
        ) : (
          <ScrollArea className="max-h-56 rounded-md border">
            <div className="divide-y">
              {onlineMembers.map((member) => {
                const checked = selectedMemberIds.includes(member.id);
                return (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 transition-colors",
                      checked ? "bg-primary/10" : "hover:bg-muted/60",
                    )}
                  >
                    <Checkbox
                      id={`online-${member.id}`}
                      checked={checked}
                      onCheckedChange={() => onToggleMember(member.id)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`online-${member.id}`}
                      className="flex-1 cursor-pointer space-y-1 text-sm"
                    >
                      <span className="block font-medium leading-none">
                        {member.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {member.role}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

function DistributionPreview({ lines }: { lines: DistributionLine[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Live deduplicated preview</Label>
        <Badge variant="outline">First 15 words</Badge>
      </div>
      <div className="h-[280px] overflow-hidden rounded-md border">
        {lines.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6 text-sm text-muted-foreground">
            Start typing to see deduplicated lines here.
          </div>
        ) : (
          <ScrollArea className="h-full">
            <ol className="space-y-3 px-4 py-4 text-sm leading-relaxed">
              {lines.map((line, index) => (
                <li
                  key={line.id}
                  className="rounded-md border border-border/60 bg-background/80 p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>#{index + 1}</span>
                    <span>{line.wordCount} words</span>
                  </div>
                  <p
                    className="mt-2 font-medium text-foreground"
                    title={line.text}
                  >
                    {line.preview}
                  </p>
                </li>
              ))}
            </ol>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

function buildDedupedLines(text: string): DistributionLine[] {
  const seen = new Set<string>();
  const result: DistributionLine[] = [];
  const rows = text.split(/\r?\n/);

  for (const row of rows) {
    const condensed = row.replace(/\s+/g, " ").trim();
    if (!condensed) {
      continue;
    }

    const key = condensed.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    const line: DistributionLine = {
      id: `line-${result.length}`,
      text: condensed,
      preview: makePreview(condensed, 15),
      wordCount: condensed.split(/\s+/).filter(Boolean).length,
    };

    result.push(line);
  }

  return result;
}

function makePreview(text: string, wordLimit: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= wordLimit) {
    return words.join(" ");
  }
  const truncated = words.slice(0, wordLimit).join(" ");
  return `${truncated}…`;
}
