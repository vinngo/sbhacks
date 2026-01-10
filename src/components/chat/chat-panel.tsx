"use client";

import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { useChat } from "@/hooks/use-chat";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function ChatPanel() {
  const { messages, isStreaming, sendMessage } = useChat();

  return (
    <Card className="flex flex-col h-full border-l rounded-none">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageSquare className="h-5 w-5" />
          Schedule Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <MessageList messages={messages} isStreaming={isStreaming} />
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </CardContent>
    </Card>
  );
}
