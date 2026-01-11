"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { ChatPanel } from "@/components/chat/chat-panel";
import { LoginScreen } from "@/components/auth/login-screen";
import { useCalendarEvents } from "@/hooks/use-calendar";
import { useSchedulerContext } from "@/context/scheduler-context";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: session, status } = useSession();
  const { currentWeek } = useSchedulerContext();
  const { isLoading, isError } = useCalendarEvents(currentWeek);
  const [showChat, setShowChat] = useState(true);
  const [chatWidth, setChatWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);

  const MIN_CHAT_WIDTH = 300;
  const MAX_CHAT_WIDTH = 600;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newWidth = window.innerWidth - e.clientX;
      setChatWidth(Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, newWidth)));
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
        <h1 className="text-xl font-light">Schedule Optimizer</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className=""
        >
          Logout
        </Button>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Calendar - takes remaining space */}
        <div className="flex-1 overflow-auto">
          <CalendarView />
        </div>

        {/* Resizable divider */}
        {showChat && (
          <div
            className={cn(
              "w-1 hover:w-2 bg-border hover:bg-primary/50 cursor-ew-resize transition-all",
              "flex items-center justify-center group",
              isDragging && "w-2 bg-primary/50"
            )}
            onMouseDown={handleMouseDown}
          >
            <div className="h-8 w-1 rounded-full bg-muted-foreground/30 group-hover:bg-primary/70" />
          </div>
        )}

        {/* Chat Panel - resizable width */}
        {showChat && (
          <div 
            className="overflow-hidden"
            style={{ width: `${chatWidth}px` }}
          >
            <ChatPanel onClose={() => setShowChat(false)} />
          </div>
        )}

        {/* Floating button to show chat when hidden */}
        {!showChat && (
          <Button
            onClick={() => setShowChat(true)}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>
    </main>
  );
}
