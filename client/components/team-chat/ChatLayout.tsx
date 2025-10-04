import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type { TeamMember, Conversation, ChatNotification, Message } from "@/data/team-chat";
import { ChatSidebar } from "./ChatSidebar";
import { ChatConversation } from "./ChatConversation";
import { NotificationTray } from "./NotificationTray";

function generateMessageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getId(obj: any) {
  if (!obj) return undefined;
  if (typeof obj === "string") return obj;
  if (obj._id) {
    if (typeof obj._id === "string") return obj._id;
    if (obj._id.$oid) return obj._id.$oid;
    try {
      return String(obj._id);
    } catch {
      return undefined;
    }
  }
  return obj.id ?? undefined;
}

export function ChatLayout() {
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);

  const playNotificationSound = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const AudioContextConstructor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    if (
      !audioContextRef.current ||
      audioContextRef.current.state === "closed"
    ) {
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

  const fetchInitialData = useCallback(async () => {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt += 1;
      try {
        const token = (() => { try { return localStorage.getItem('token'); } catch { return null; } })();
        const headers: any = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const [teamRes, convRes] = await Promise.all([
          fetch('/api/team', { headers }),
          fetch('/api/chat/conversations', { headers }),
        ]);

        if (!teamRes.ok || !convRes.ok) {
          const teamText = await teamRes.text().catch(() => "<no-body>");
          const convText = await convRes.text().catch(() => "<no-body>");
          console.error(`Failed to fetch initial chat data (attempt ${attempt}): teamRes=${teamRes.status}, convRes=${convRes.status}`, { teamText, convText });
          // wait before retrying
          await new Promise((r) => setTimeout(r, 500 * attempt));
          continue;
        }

        const team = await teamRes.json();
        const convs = await convRes.json();

        setMembers(
          (team || []).map((u: any) => ({
            id: getId(u) ?? u.email,
            name: u.name,
            role: u.role ?? 'member',
            status: u.status ?? 'online',
            location: u.location ?? '',
            avatarUrl: u.avatarUrl ?? undefined,
          })),
        );

        // Load messages for each conversation
        const convsWithMessages: Conversation[] = [];

        for (const conv of convs || []) {
          const convId = getId(conv) ?? conv.id;
          const messagesRes = await fetch(`/api/chat/${convId}/messages`);
          const msgs = messagesRes.ok ? await messagesRes.json() : [];

          const mappedMessages: Message[] = (msgs || []).map((m: any) => ({
            id: getId(m) ?? m.id,
            authorId: m.authorId,
            content: m.content,
            sentAt: m.sentAt,
            status: m.status ?? 'delivered',
          }));

          // Determine memberId for UI (for 1:1 chats use first member id)
          const memberId = conv.memberId ?? (Array.isArray(conv.memberIds) ? conv.memberIds[0] : undefined);

          convsWithMessages.push({
            id: convId,
            memberId: memberId,
            unreadCount: conv.unreadCount ?? 0,
            pinned: conv.pinned ?? false,
            lastMessagePreview: conv.lastMessagePreview ?? (mappedMessages[mappedMessages.length - 1]?.content ?? ''),
            lastMessageAt: conv.lastMessageAt ?? (mappedMessages[mappedMessages.length - 1]?.sentAt ?? new Date().toISOString()),
            messages: mappedMessages,
          });
        }

        // Sort and set
        convsWithMessages.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
        setConversations(convsWithMessages);

        // set initial active conversation
        const firstId = convsWithMessages[0]?.id ?? '';
        setActiveConversationId(firstId);
        return;
      } catch (e) {
        console.error(`Error fetching chat data (attempt ${attempt})`, e);
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }

    console.error('Failed to fetch initial chat data after retries');
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Poll for new conversations/messages to show notifications and update unread counts
  useEffect(() => {
    let mounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/chat/conversations');
        if (!res.ok) return;
        const convs = await res.json();
        if (!mounted) return;

        setConversations((current) => {
          const next = [...current];
          for (const conv of convs || []) {
            const convId = getId(conv) ?? conv.id;
            const existing = next.find((c) => c.id === convId);
            if (!existing) {
              // New conversation - fetch messages
              (async () => {
                const messagesRes = await fetch(`/api/chat/${convId}/messages`);
                const msgs = messagesRes.ok ? await messagesRes.json() : [];
                const mappedMessages: Message[] = (msgs || []).map((m: any) => ({ id: getId(m) ?? m.id, authorId: m.authorId, content: m.content, sentAt: m.sentAt, status: m.status ?? 'delivered' }));
                setConversations((cur) => {
                  const merged = [...cur, {
                    id: convId,
                    memberId: conv.memberId ?? (Array.isArray(conv.memberIds) ? conv.memberIds[0] : undefined),
                    unreadCount: conv.unreadCount ?? 0,
                    pinned: conv.pinned ?? false,
                    lastMessagePreview: conv.lastMessagePreview ?? (mappedMessages[mappedMessages.length - 1]?.content ?? ''),
                    lastMessageAt: conv.lastMessageAt ?? (mappedMessages[mappedMessages.length - 1]?.sentAt ?? new Date().toISOString()),
                    messages: mappedMessages,
                  }];
                  return merged.sort((a,b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
                });
              })();
              continue;
            }

            const newLast = conv.lastMessageAt ?? existing.lastMessageAt;
            if (new Date(newLast).getTime() > new Date(existing.lastMessageAt).getTime()) {
              // New message arrived
              existing.lastMessageAt = conv.lastMessageAt ?? existing.lastMessageAt;
              existing.lastMessagePreview = conv.lastMessagePreview ?? existing.lastMessagePreview;
              existing.unreadCount = (existing.unreadCount || 0) + 1;

              // create notification
              const noteId = `note-${generateMessageId()}`;
              setNotifications((n) => [
                { id: noteId, type: 'message', memberId: existing.memberId, title: 'New message', description: existing.lastMessagePreview, createdAt: new Date().toISOString() },
                ...n,
              ].slice(0, 10));

              // play sound
              playNotificationSound();
            }
          }

          return next.sort((a,b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
        });
      } catch (e) {
        console.error('Polling chat failed', e);
      }
    }, 5000);

    return () => { mounted = false; clearInterval(interval); };
  }, [playNotificationSound]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId],
  );

  const activeMember = useMemo(() => {
    if (!activeConversation) return undefined;
    return members.find((m) => m.id === activeConversation.memberId);
  }, [activeConversation, members]);

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      }),
    [conversations],
  );

  const handleSelectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);

    // mark messages as read locally
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id !== conversationId
          ? conversation
          : { ...conversation, unreadCount: 0, messages: conversation.messages.map((msg) => ({ ...msg, status: msg.authorId === conversation.memberId ? 'read' : msg.status })) },
      ),
    );
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeConversation) return;
    const now = new Date().toISOString();
    const id = `msg-${generateMessageId()}`;

    // Optimistic update
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id !== activeConversation.id
          ? conversation
          : {
              ...conversation,
              lastMessagePreview: content,
              lastMessageAt: now,
              unreadCount: 0,
              messages: [
                ...conversation.messages,
                { id, authorId: 'current-user', content, sentAt: now, status: 'sent' },
              ],
            },
      ),
    );

    try {
      const res = await fetch(`/api/chat/${activeConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: 'current-user', content }),
      });

      if (!res.ok) throw new Error('Failed to send');
      const saved = await res.json();

      // replace optimistic message id with real id from server
      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== activeConversation.id) return conversation;
          return {
            ...conversation,
            messages: conversation.messages.map((m) => (m.id === id ? { ...m, id: getId(saved) ?? m.id, status: saved.status ?? 'delivered' } : m)),
          };
        }),
      );
    } catch (e) {
      console.error('Send failed', e);
      toast('Failed to send message');
    }
  }, [activeConversation]);

  if (!activeConversation || !activeMember) {
    return null;
  }

  return (
    <div className="flex flex-1 min-h-0 gap-6">
      <ChatSidebar
        members={members}
        conversations={sortedConversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
      />
      <div className="relative flex flex-1">
        <ChatConversation member={activeMember} conversation={activeConversation} onSendMessage={handleSendMessage} />
        <NotificationTray
          notifications={notifications.slice(0, 3)}
          members={members}
          onOpenConversation={(notificationId, memberId) => {
            // open the associated conversation and remove notification
            const conv = conversations.find((c) => c.memberId === memberId);
            if (conv) {
              setActiveConversationId(conv.id);
              setConversations((current) => current.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c)));
            }
            setNotifications((n) => n.filter((x) => x.id !== notificationId));
          }}
          onDismiss={(notificationId) => setNotifications((n) => n.filter((x) => x.id !== notificationId))}
        />
      </div>
    </div>
  );
}
