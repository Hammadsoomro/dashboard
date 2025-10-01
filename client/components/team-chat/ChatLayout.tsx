import { useCallback, useMemo, useState } from "react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { teamChatData, type ChatNotification } from "@/data/team-chat";

import { ChatSidebar } from "./ChatSidebar";
import { ChatConversation } from "./ChatConversation";
import { NotificationTray } from "./NotificationTray";

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

type IncomingNotificationPayload = Omit<ChatNotification, "id" | "createdAt">;

const initialConversationId = [...initialConversations]
  .sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  })[0]?.id;

export function ChatLayout() {
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversationId ?? teamChatData.conversations[0]?.id ?? "",
  );
  const [conversations, setConversations] = useState(initialConversations);
  const [notifications, setNotifications] = useState<ChatNotification[]>(
    teamChatData.notifications.map((notification) => ({ ...notification })),
  );
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasSimulatedMessageRef = useRef(false);

  const members = teamChatData.members;

  const playNotificationSound = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const AudioContextConstructor =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      audioContextRef.current = new AudioContextConstructor();
    }

    const context = audioContextRef.current;
    if (!context) {
      return;
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.24, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.45);
  }, []);

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
      current.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        const updatedMessages = conversation.messages.map((message, index, array) => {
          if (
            index === array.length - 1 &&
            message.authorId === conversation.memberId &&
            message.status !== "read"
          ) {
            return { ...message, status: "read" as const };
          }

          return message;
        });

        return {
          ...conversation,
          unreadCount: 0,
          messages: updatedMessages,
        };
      }),
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

  const handleIncomingMessage = useCallback(
    (
      conversationId: string,
      messageContent: string,
      notificationDetails?: IncomingNotificationPayload,
    ) => {
      const sentAt = new Date().toISOString();
      const messageId = `msg-${generateMessageId()}`;
      let targetMemberId: string | undefined;

      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== conversationId) {
            return conversation;
          }

          targetMemberId = conversation.memberId;
          const isActive = conversationId === activeConversationId;

          return {
            ...conversation,
            unreadCount: isActive ? 0 : conversation.unreadCount + 1,
            lastMessagePreview: messageContent,
            lastMessageAt: sentAt,
            messages: [
              ...conversation.messages,
              {
                id: messageId,
                authorId: conversation.memberId,
                content: messageContent,
                sentAt,
                status: isActive ? ("read" as const) : ("delivered" as const),
              },
            ],
          };
        }),
      );

      if (notificationDetails && targetMemberId) {
        const fullNotification: ChatNotification = {
          id: `notif-${generateMessageId()}`,
          createdAt: sentAt,
          memberId: targetMemberId,
          ...notificationDetails,
        };

        setNotifications((current) => [fullNotification, ...current]);
        toast(fullNotification.title, {
          description: fullNotification.description,
        });
      }

      playNotificationSound();
    },
    [activeConversationId, playNotificationSound],
  );

  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (hasSimulatedMessageRef.current) {
      return;
    }

    hasSimulatedMessageRef.current = true;
    const timer = window.setTimeout(() => {
      handleIncomingMessage(
        "conv-brian-carter",
        "Heads up! The AI brief is ready for your review.",
        {
          title: "Brian pinged you with an update",
          description: "“Heads up! The AI brief is ready for your review.”",
          type: "mention",
        },
      );
    }, 5200);

    return () => window.clearTimeout(timer);
  }, [handleIncomingMessage]);

  const handleDismissNotification = useCallback((notificationId: string) => {
    setNotifications((current) => current.filter((item) => item.id !== notificationId));
  }, []);

  const handleNotificationOpen = useCallback(
    (notificationId: string, memberId: string | undefined) => {
      setNotifications((current) => current.filter((item) => item.id !== notificationId));

      if (!memberId) {
        return;
      }

      let targetConversationId: string | undefined;
      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.memberId !== memberId) {
            return conversation;
          }

          targetConversationId = conversation.id;
          return {
            ...conversation,
            unreadCount: 0,
            messages: conversation.messages.map((message, index, array) => {
              if (
                index === array.length - 1 &&
                message.authorId === conversation.memberId &&
                message.status !== "read"
              ) {
                return { ...message, status: "read" as const };
              }

              return message;
            }),
          };
        }),
      );

      if (targetConversationId) {
        setActiveConversationId(targetConversationId);
      }
    },
    [],
  );

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort((a, b) => {
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
      <div className="relative flex flex-1">
        <ChatConversation
          member={activeMember}
          conversation={activeConversation}
          onSendMessage={handleSendMessage}
        />
        <NotificationTray
          notifications={notifications.slice(0, 3)}
          members={members}
          onOpenConversation={handleNotificationOpen}
          onDismiss={handleDismissNotification}
        />
      </div>
    </div>
  );
}
