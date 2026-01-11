"use client";

import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { useChat } from "@/hooks/use-chat";
import { ActionBar } from "@/components/shared/action-bar";
import { X } from "lucide-react";
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
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="font-semibold text-sm">Agent</span>
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
          <div className="flex-1" />
        ) : (
          <div className="flex-1 overflow-auto">
            <MessageList messages={messages} isStreaming={isStreaming} />
          </div>
        )}
      </div>

      {/* Bottom input area */}
      <div className="bg-background">
        <ActionBar />
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
}
