import AppShell from "@/components/layout/AppShell";

import { ChatLayout } from "@/components/team-chat/ChatLayout";

export default function TeamChat() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6 py-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-foreground">Team Chat</h1>
          <p className="text-muted-foreground text-sm">
            Coordinate with the Product Studio crew, hand off ideas, and review
            updates in real time.
          </p>
        </div>
        <ChatLayout />
      </div>
    </AppShell>
  );
}
