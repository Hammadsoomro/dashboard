import { useMemo, useState } from "react";

import { teamChatData } from "@/data/team-chat";
import {
  type DistributionLine,
  useDistributor,
} from "@/hooks/use-distributor";
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
  const onlineMembers = useMemo(
    () => teamChatData.members.filter((member) => member.status === "online"),
    [],
  );
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
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

  const intervalSeconds = INTERVAL_OPTIONS[intervalIndex] ?? INTERVAL_OPTIONS[0];

  const handleToggleMember = (memberId: string) => {
    setSelectedMemberIds((current) => {
      if (current.includes(memberId)) {
        return current.filter((id) => id !== memberId);
      }
      return [...current, memberId];
    });
  };

  const handleSubmit = () => {
    if (!dedupedLines.length || !selectedMemberIds.length) {
      return;
    }

    const record = addDistribution({
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
  };

  const sliderValue = [intervalIndex];

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
              <Label htmlFor="distributor-input" className="text-sm font-medium">
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
          onToggleMember={handleToggleMember}
          intervalSeconds={intervalSeconds}
          onlineMemberCount={onlineMembers.length}
        />
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-sm text-muted-foreground">
          Sending {linesPerMember} line(s) per teammate every {intervalSeconds}{