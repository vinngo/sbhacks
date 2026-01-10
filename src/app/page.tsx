"use client";

import { CalendarView } from "@/components/calendar/calendar-view";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ActionBar } from "@/components/shared/action-bar";
import { ConnectionStatus } from "@/components/shared/connection-status";
import { useCalendarEvents } from "@/hooks/use-calendar";
import { useSchedulerContext } from "@/context/scheduler-context";
import { USE_MOCK_DATA } from "@/lib/mock-data";

export default function Home() {
  const { currentWeek } = useSchedulerContext();
  const { isLoading, isError } = useCalendarEvents(currentWeek);

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
        <h1 className="text-xl font-bold">Schedule Optimizer</h1>
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

      {/* Action Bar */}
      <ActionBar />
    </main>
  );
}
