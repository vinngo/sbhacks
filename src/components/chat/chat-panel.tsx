"use client";

import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { useChat } from "@/hooks/use-chat";
import { ActionBar } from "@/components/shared/action-bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatPanelProps = {
  onClose?: () => void;
};

export function ChatPanel({ onClose }: ChatPanelProps) {
  const { messages, isStreaming, sendMessage } = useChat();

  return (
    <Card className="flex flex-col h-full border-l rounded-none">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-5 w-5" />
            Schedule Assistant
          </CardTitle>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <MessageList messages={messages} isStreaming={isStreaming} />
        </div>
        <div className="sticky bottom-0 bg-background border-t">
          <ActionBar />
          <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </div>
      </CardContent>
    </Card>
  );
}
