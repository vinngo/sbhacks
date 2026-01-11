"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "./message";
import type { Message as MessageType } from "@/lib/types";

type MessageListProps = {
  messages: MessageType[];
  isStreaming?: boolean;
};

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return <div></div>;
  }

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="px-3 py-2">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {/* Typing indicator - iMessage style */}
        {isStreaming && (
          <div className="flex justify-start mb-1.5">
            <div className="bg-muted rounded-[20px] rounded-bl-[4px] px-4 py-2.5">
              <div className="flex gap-1 items-center h-[21px]">
                <span className="h-2 w-2 rounded-full bg-foreground/40 animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-foreground/40 animate-pulse [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-foreground/40 animate-pulse [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
