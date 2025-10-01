import { useEffect, useMemo, useRef, useState } from "react";
import {
  Paperclip,
  Smile,
  Send,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";

import type { Conversation, Message, TeamMember } from "@/data/team-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const currentUser = {
  id: "current-user",
  name: "Arham Khan",
  role: "Admin",
};

export interface ChatConversationProps {
  member: TeamMember;
  conversation: Conversation;
  onSendMessage: (body: string) => void;
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function groupMessagesByDate(messages: Message[]) {
  return messages.reduce<Record<string, Message[]>>((acc, message) => {
    const key = new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
    }).format(new Date(message.sentAt));

    acc[key] = acc[key] ? [...acc[key], message] : [message];
    return acc;
  }, {});
}

export function ChatConversation({
  member,
  conversation,
  onSendMessage,
}: ChatConversationProps) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const grouped = useMemo(
    () => groupMessagesByDate(conversation.messages),
    [conversation.messages],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [conversation.messages]);

  const isDraftValid = draft.trim().length > 0;

  const handleSubmit = () => {
    if (!isDraftValid) {
      return;
    }

    onSendMessage(draft.trim());
    setDraft("");
  };

  return (
    <div className="flex h-full flex-1 flex-col rounded-3xl border border-border/70 bg-white/70 backdrop-blur dark:bg-neutral-900/70">
      <header className="flex items-center gap-4 rounded-t-3xl border-b border-border/60 px-8 py-5">
        <Avatar className="h-14 w-14">
          <AvatarImage src={member.avatarUrl} alt={member.name} />
          <AvatarFallback className="rounded-2xl text-lg font-semibold">
            {member.name
              .split(" ")
              .map((segment) => segment.charAt(0))
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">
              {member.name}
            </h2>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
              {member.role}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{member.location}</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl"
            aria-label="Start voice call"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl"
            aria-label="Start video call"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto px-8 py-6"
      >
        {Object.entries(grouped).map(([date, messages]) => (
          <section key={date} className="space-y-4">
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-600">
                {date}
              </span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-4">
              {messages.map((message) => {
                const isOwn = message.authorId === currentUser.id;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      isOwn ? "justify-end" : "justify-start",
                    )}
                  >
                    <div className="max-w-[80%] space-y-1">
                      <motion.div
                        layout
                        className={cn(
                          "rounded-3xl px-5 py-3 text-sm shadow-sm",
                          isOwn
                            ? "bg-amber-500 text-white shadow-[0_15px_35px_-20px_rgba(251,191,36,0.9)]"
                            : "bg-white text-foreground shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)] dark:bg-neutral-900",
                        )}
                      >
                        {message.content}
                      </motion.div>
                      <div
                        className={cn(
                          "flex items-center gap-2 text-[11px] uppercase tracking-wide",
                          isOwn
                            ? "justify-end text-white/80"
                            : "justify-start text-muted-foreground",
                        )}
                      >
                        <time dateTime={message.sentAt}>
                          {formatTimestamp(message.sentAt)}
                        </time>
                        {isOwn && (
                          <span>
                            {message.status === "read"
                              ? "Seen"
                              : message.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <footer className="rounded-b-3xl border-t border-border/60 bg-white/90 px-6 py-5 dark:bg-neutral-950/60">
        <div className="flex items-end gap-4">
          <div className="flex flex-1 flex-col gap-3">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={`Message ${member.name}`}
              className="min-h-[72px] rounded-3xl border border-border/80 bg-white/80 px-5 py-4 text-sm shadow-inner focus-visible:ring-amber-500 dark:bg-neutral-900/80"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl"
                  aria-label="Attach a file"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl"
                  aria-label="Insert emoji"
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!isDraftValid}
                className="rounded-2xl bg-amber-500 text-white hover:bg-amber-500/90"
              >
                <Send className="h-4 w-4" />
                <span className="text-sm font-semibold">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
