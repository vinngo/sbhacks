"use client";

import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { useChat } from "@/hooks/use-chat";
import { ActionBar } from "@/components/shared/action-bar";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatPanelProps = {
  onClose?: () => void;
};

export function ChatPanel({ onClose }: ChatPanelProps) {
  const { messages, isStreaming, sendMessage } = useChat();

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-background" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight">
              Schedule Assistant
            </span>
            <span className="text-xs text-muted-foreground">AI Assistant</span>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-background">
        {!hasMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-3">
              <MessageCircle className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground max-w-[220px]">
              Describe tasks you&apos;d like to schedule and I&apos;ll find the
              best times.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <MessageList messages={messages} isStreaming={isStreaming} />
          </div>
        )}
      </div>

      {/* Bottom input area */}
      <div className="border-t border-border bg-background">
        <ActionBar />
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
}
