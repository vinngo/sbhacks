"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function ChatInput({
  onSend,
  disabled,
  placeholder = "Ask about scheduling...",
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

  const canSend = input.trim().length > 0 && !disabled;

  return (
    <div className="px-3 py-2">
      <div
        className={cn(
          "relative flex items-end rounded-full bg-muted",
          "transition-all duration-200",
        )}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "min-h-[36px] max-h-[100px] resize-none border-0 bg-transparent pl-4 pr-11 py-2",
            "text-[15px] placeholder:text-muted-foreground",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            disabled && "opacity-50",
          )}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "absolute right-1.5 bottom-1.5 h-7 w-7 rounded-full",
            "flex items-center justify-center transition-all duration-150 cursor-pointer",
            canSend
              ? "bg-foreground text-background"
              : "bg-transparent text-muted-foreground/30",
          )}
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
