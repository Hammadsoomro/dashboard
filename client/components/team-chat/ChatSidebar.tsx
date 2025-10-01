import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Pin } from "lucide-react";

import type { Conversation, TeamMember } from "@/data/team-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface ChatSidebarProps {
  members: TeamMember[];
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (conversationId: string) => void;
}

const statusColors: Record<string, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-muted-foreground/50",
  dnd: "bg-red-500",
};

export function ChatSidebar({
  members,
  conversations,
  activeConversationId,
  onSelectConversation,
}: ChatSidebarProps) {
  const [query, setQuery] = useState("");

  const summaries = useMemo(() => {
    return conversations
      .map((conversation) => {
        const member = members.find(
          (item) => item.id === conversation.memberId,
        );
        if (!member) {
          return null;
        }

        const haystack =
          `${member.name} ${member.role} ${conversation.lastMessagePreview}`.toLowerCase();
        const matchesQuery = haystack.includes(query.trim().toLowerCase());

        return {
          conversation,
          member,
          matchesQuery,
        };
      })
      .filter((entry): entry is Exclude<typeof entry, null> => {
        if (!entry) {
          return false;
        }

        if (!query.trim()) {
          return true;
        }

        return entry.matchesQuery;
      })
      .sort((a, b) => {
        if (a.conversation.pinned && !b.conversation.pinned) return -1;
        if (!a.conversation.pinned && b.conversation.pinned) return 1;
        return (
          new Date(b.conversation.lastMessageAt).getTime() -
          new Date(a.conversation.lastMessageAt).getTime()
        );
      });
  }, [conversations, members, query]);

  return (
    <div className="flex h-full w-full max-w-sm flex-col rounded-3xl border border-border/70 bg-white/70 backdrop-blur dark:bg-neutral-900/60">
      <div className="flex items-center gap-2 px-5 pt-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-lg font-semibold text-white shadow-lg">
          TC
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Team chat
          </p>
          <p className="text-base font-semibold text-foreground">
            Product Studio
          </p>
        </div>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="icon"
            className="rounded-2xl border-dashed"
            aria-label="Start new chat"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-5 pb-4 pt-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search teammates or messages"
            className="rounded-2xl border border-border/80 bg-white pl-10 shadow-sm dark:bg-neutral-900"
            aria-label="Search teammates"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2" type="always">
        <div className="space-y-2 pb-6">
          {summaries.map(({ conversation, member }) => {
            const isActive = conversation.id === activeConversationId;
            const statusColor =
              statusColors[member.status] ?? statusColors.offline;

            return (
              <motion.button
                key={conversation.id}
                layout
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left transition hover:bg-amber-500/10",
                  isActive &&
                    "border-amber-500/40 bg-amber-500/15 shadow-[0_10px_30px_-12px_rgba(251,191,36,0.55)]",
                )}
              >
                <span
                  className={cn(
                    "absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-amber-600 shadow-sm",
                    conversation.unreadCount === 0 && "hidden",
                  )}
                >
                  {conversation.unreadCount}
                </span>

                {conversation.pinned && (
                  <span
                    className="absolute right-3 top-3 text-amber-500"
                    aria-label="Pinned conversation"
                  >
                    <Pin className="h-3.5 w-3.5" />
                  </span>
                )}

                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback className="rounded-2xl text-base">
                      {member.name
                        .split(" ")
                        .map((part) => part.charAt(0))
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                      statusColor,
                    )}
                    aria-hidden
                  />
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {member.name}
                    </p>
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
                      {member.role}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {conversation.lastMessagePreview}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <time
                    className="text-[11px] font-medium text-muted-foreground"
                    dateTime={conversation.lastMessageAt}
                  >
                    {new Intl.DateTimeFormat("en", {
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(new Date(conversation.lastMessageAt))}
                  </time>
                  {conversation.unreadCount > 0 && (
                    <span
                      className="flex h-2 w-2 rounded-full bg-amber-500"
                      aria-hidden
                    />
                  )}
                </div>
              </motion.button>
            );
          })}

          {summaries.length === 0 && (
            <p className="px-3 text-sm text-muted-foreground">
              No teammates found for that search.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
