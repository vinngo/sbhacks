"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { ChatPanel } from "@/components/chat/chat-panel";
import { LoginScreen } from "@/components/auth/login-screen";
import { useCalendarEvents } from "@/hooks/use-calendar";
import { useSchedulerContext } from "@/context/scheduler-context";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();
  const { currentWeek } = useSchedulerContext();
  const { isLoading, isError } = useCalendarEvents(currentWeek);

  // Show login screen if not authenticated
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <LoginScreen onGoogleLogin={() => signIn("google")} />;
  }

  // Determine connection status
  const connectionStatus = isLoading
    ? "loading"
    : isError
      ? "error"
      : "connected";

  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
        <h1 className="text-xl font-light font-serif">Schedule Optimizer</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="font-serif"
        >
          Logout
        </Button>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar - 2/3 width */}
        <div className="flex-[2] overflow-auto">
          <CalendarView />
        </div>

        {/* Chat Panel - 1/3 width */}
        <div className="flex-1 min-w-[350px] max-w-[450px]">
          <ChatPanel />
        </div>
      </div>
    </main>
  );
}
