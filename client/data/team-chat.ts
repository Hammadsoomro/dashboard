export type PresenceStatus = "online" | "away" | "offline" | "dnd";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: PresenceStatus;
  location: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  authorId: string;
  content: string;
  sentAt: string;
  status: "sent" | "delivered" | "read";
  attachments?: Array<{ id: string; name: string; url: string }>;
}

export interface Conversation {
  id: string;
  memberId: string;
  unreadCount: number;
  pinned?: boolean;
  lastMessagePreview: string;
  lastMessageAt: string;
  messages: Message[];
}

export interface ChatNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  type: "mention" | "system" | "reminder";
  memberId?: string;
}

export interface TeamChatData {
  members: TeamMember[];
  conversations: Conversation[];
  notifications: ChatNotification[];
}

export const teamChatData: TeamChatData = {
  members: [
    {
      id: "anna-johnson",
      name: "Anna Johnson",
      role: "Product Designer",
      status: "online",
      location: "Remote · 9:15 AM",
      avatarUrl:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    {
      id: "brian-carter",
      name: "Brian Carter",
      role: "AI Researcher",
      status: "away",
      location: "HQ · 9:22 AM",
    },
    {
      id: "clara-mills",
      name: "Clara Mills",
      role: "Support Lead",
      status: "online",
      location: "Remote · 9:29 AM",
    },
    {
      id: "henry-moore",
      name: "Henry Moore",
      role: "Growth Manager",
      status: "offline",
      location: "SF · Last seen 7:45 AM",
    },
    {
      id: "isabella-ray",
      name: "Isabella Ray",
      role: "Marketing Strategist",
      status: "online",
      location: "Remote · 9:31 AM",
    },
    {
      id: "steve-evans",
      name: "Steve Evans",
      role: "Engineering Lead",
      status: "dnd",
      location: "HQ · Focus mode",
    },
  ],
  conversations: [
    {
      id: "conv-anna-johnson",
      memberId: "anna-johnson",
      unreadCount: 0,
      pinned: true,
      lastMessagePreview:
        "Let me know if you need any changes before the sync.",
      lastMessageAt: "2024-09-15T09:18:00Z",
      messages: [
        {
          id: "msg-1",
          authorId: "anna-johnson",
          content:
            "Hey! How's it going today? I've been wrapping up the visual audit for the dashboard cards.",
          sentAt: "2024-09-15T09:15:00Z",
          status: "read",
        },
        {
          id: "msg-2",
          authorId: "current-user",
          content:
            "Morning! Could you help me figure out if we still want the neutral background on the empty states?",
          sentAt: "2024-09-15T09:16:15Z",
          status: "read",
        },
        {
          id: "msg-3",
          authorId: "anna-johnson",
          content:
            "Sure! Here's the concept I'll use: fog along the slopes, an amber gradient sky, and small birds for movement. Thoughts?",
          sentAt: "2024-09-15T09:17:05Z",
          status: "read",
        },
        {
          id: "msg-4",
          authorId: "current-user",
          content:
            "Let's go with semi-illustrative—keep the birds please. Also, can we soften the tree silhouettes?",
          sentAt: "2024-09-15T09:17:45Z",
          status: "read",
        },
        {
          id: "msg-5",
          authorId: "anna-johnson",
          content:
            "Got it! I'll update the mockups and drop them in the thread before the design review.",
          sentAt: "2024-09-15T09:18:00Z",
          status: "read",
        },
      ],
    },
    {
      id: "conv-brian-carter",
      memberId: "brian-carter",
      unreadCount: 3,
      lastMessagePreview: "Shipping the documentation update in an hour.",
      lastMessageAt: "2024-09-15T09:22:00Z",
      messages: [
        {
          id: "msg-6",
          authorId: "brian-carter",
          content:
            "Checking in—how's everything looking on your side of the launch plan?",
          sentAt: "2024-09-15T09:20:32Z",
          status: "delivered",
        },
        {
          id: "msg-7",
          authorId: "current-user",
          content:
            "Almost there. Need your confirmation on the research summary bullet points.",
          sentAt: "2024-09-15T09:21:08Z",
          status: "delivered",
        },
        {
          id: "msg-8",
          authorId: "brian-carter",
          content:
            "On it. Shipping the documentation update in an hour so you can plug it in.",
          sentAt: "2024-09-15T09:22:00Z",
          status: "sent",
        },
      ],
    },
    {
      id: "conv-clara-mills",
      memberId: "clara-mills",
      unreadCount: 1,
      lastMessagePreview: "OMG, you won't believe what just happened—sharing in the retro!",
      lastMessageAt: "2024-09-15T09:30:12Z",
      messages: [
        {
          id: "msg-9",
          authorId: "clara-mills",
          content:
            "OMG, you won't believe what just happened—sharing in the retro!",
          sentAt: "2024-09-15T09:30:12Z",
          status: "sent",
        },
      ],
    },
    {
      id: "conv-henry-moore",
      memberId: "henry-moore",
      unreadCount: 0,
      lastMessagePreview: "Could you double-check the integrations deck?",
      lastMessageAt: "2024-09-15T09:34:00Z",
      messages: [
        {
          id: "msg-10",
          authorId: "henry-moore",
          content:
            "Just checking in—how's everything tracking for the partnership review?",
          sentAt: "2024-09-15T09:32:44Z",
          status: "read",
        },
        {
          id: "msg-11",
          authorId: "current-user",
          content:
            "Running through the list now. Anything specific you want highlighted?",
          sentAt: "2024-09-15T09:33:06Z",
          status: "read",
        },
        {
          id: "msg-12",
          authorId: "henry-moore",
          content:
            "Could you double-check the integrations deck? I want to link it before lunch.",
          sentAt: "2024-09-15T09:34:00Z",
          status: "read",
        },
      ],
    },
    {
      id: "conv-isabella-ray",
      memberId: "isabella-ray",
      unreadCount: 2,
      lastMessagePreview: "We still need testimonials before going live.",
      lastMessageAt: "2024-09-15T09:31:36Z",
      messages: [
        {
          id: "msg-13",
          authorId: "isabella-ray",
          content:
            "Hey! How's it going today? I've been thinking about the new tagline.",
          sentAt: "2024-09-15T09:28:42Z",
          status: "delivered",
        },
        {
          id: "msg-14",
          authorId: "current-user",
          content: "Let's ask Sunday AI to generate a shortlist after standup.",
          sentAt: "2024-09-15T09:29:16Z",
          status: "delivered",
        },
        {
          id: "msg-15",
          authorId: "isabella-ray",
          content:
            "Copy that! We still need testimonials before going live, so I'm nudging the beta users.",
          sentAt: "2024-09-15T09:31:36Z",
          status: "sent",
        },
      ],
    },
    {
      id: "conv-steve-evans",
      memberId: "steve-evans",
      unreadCount: 0,
      lastMessagePreview: "Mind if I move the release note to tomorrow?",
      lastMessageAt: "2024-09-15T08:52:24Z",
      messages: [
        {
          id: "msg-16",
          authorId: "steve-evans",
          content:
            "Morning! Do you have the latest metrics ready for the leadership channel?",
          sentAt: "2024-09-15T08:49:10Z",
          status: "read",
        },
        {
          id: "msg-17",
          authorId: "current-user",
          content:
            "Yes! Uploading now. Mind if I move the release note to tomorrow to accommodate QA?",
          sentAt: "2024-09-15T08:52:24Z",
          status: "read",
        },
      ],
    },
  ],
  notifications: [
    {
      id: "notif-1",
      memberId: "brian-carter",
      title: "Brian mentioned you in #launch-sept",
      description: "“Can you drop the storyboard asset links here?”",
      createdAt: "2024-09-15T09:24:50Z",
      type: "mention",
    },
    {
      id: "notif-2",
      memberId: "clara-mills",
      title: "Support queue at 80% capacity",
      description: "Clara suggests pulling in an extra specialist for the morning rush.",
      createdAt: "2024-09-15T09:27:20Z",
      type: "reminder",
    },
    {
      id: "notif-3",
      title: "Daily standup begins in 5 minutes",
      description: "Join the voice room if you have blockers for the growth release.",
      createdAt: "2024-09-15T09:40:00Z",
      type: "system",
    },
  ],
};
