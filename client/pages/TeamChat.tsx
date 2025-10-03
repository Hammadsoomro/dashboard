import AppShell from "@/components/layout/AppShell";
import { ChatLayout } from "@/components/team-chat/ChatLayout";

export default function TeamChat() {
  return (
    <AppShell>
      <div className="flex min-h-full flex-col gap-3">
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold text-foreground">Team Chat</h1>
        </div>
        <ChatLayout />
      </div>
    </AppShell>
  );
}
