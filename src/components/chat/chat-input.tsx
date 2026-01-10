"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function ChatInput({
  onSend,
  disabled,
  placeholder = "Describe tasks to schedule...",
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = useCallback(() => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  }, [input, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, newline on Shift+Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border relative">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "min-h-[60px] max-h-[150px] resize-none border-transparent shadow-none focus-visible:border-transparent !ring-0 focus-visible:!ring-0",
          disabled && "opacity-50",
        )}
        rows={2}
      />
      <div className="flex justify-end pr-2">
        <Button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          size="sm"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
