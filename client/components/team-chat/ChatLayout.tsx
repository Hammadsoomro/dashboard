import { useCallback, useMemo, useState } from "react";

import { teamChatData } from "@/data/team-chat";

import { ChatSidebar } from "./ChatSidebar";
import { ChatConversation } from "./ChatConversation";

function cloneConversations() {
  return teamChatData.conversations.map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) => ({ ...message })),
  }));
}

function generateMessageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const initialConversations = cloneConversations();

const initialConversationId = initialConversations
  .toSorted((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  })[0]?.id;

export function ChatLayout() {
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversationId ?? teamChatData.conversations[0]?.id ?? "",
  );
  const [conversations, setConversations] = useState(initialConversations);

  const members = teamChatData.members;

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [conversations, activeConversationId],
  );

  const activeMember = useMemo(() => {
    if (!activeConversation) {
      return undefined;
    }

    return members.find((member) => member.id === activeConversation.memberId);
  }, [activeConversation, members]);

  const handleSelectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unreadCount: 0,
            }
          : conversation,
      ),
    );
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      const now = new Date().toISOString();
      const id = `msg-${generateMessageId()}`;

      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== activeConversationId) {
            return conversation;
          }

          return {
            ...conversation,
            lastMessagePreview: content,
            lastMessageAt: now,
            unreadCount: 0,
            messages: [
              ...conversation.messages,
              {
                id,
                authorId: "current-user",
                content,
                sentAt: now,
                status: "sent" as const,
              },
            ],
          };
        }),
      );
    },
    [activeConversationId],
  );

  const sortedConversations = useMemo(
    () =>
      conversations.toSorted((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      }),
    [conversations],
  );

  if (!activeConversation || !activeMember) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 lg:h-[calc(100vh-10rem)]">
      <ChatSidebar
        members={members}
        conversations={sortedConversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
      />
      <ChatConversation
        member={activeMember}
        conversation={activeConversation}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
