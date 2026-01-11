"use client";

import { cn } from "@/lib/utils";
import type { Message as MessageType } from "@/lib/types";

type MessageProps = {
  message: MessageType;
};

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-1.5",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] min-w-0 px-3.5 py-2 text-[15px] leading-[1.4] break-words overflow-hidden",
          isUser
            ? "bg-foreground text-background rounded-[20px] rounded-br-[4px]"
            : "bg-muted text-foreground rounded-[20px] rounded-bl-[4px]",
        )}
      >
        {/* Simple markdown-like rendering for code blocks */}
        {message.content.split(/(```[\s\S]*?```)/g).map((part, i) => {
          if (part.startsWith("```") && part.endsWith("```")) {
            // Code block
            const lines = part.slice(3, -3).split("\n");
            const language = lines[0];
            const code = lines.slice(1).join("\n");
            return (
              <pre
                key={i}
                className={cn(
                  "rounded-lg p-2.5 my-1.5 text-xs overflow-x-auto w-full",
                  isUser ? "bg-background/20" : "bg-background/50",
                )}
              >
                <code
                  className={cn(
                    "block whitespace-pre-wrap break-all",
                    isUser ? "text-background/90" : "text-foreground/90",
                  )}
                >
                  {code || language}
                </code>
              </pre>
            );
          }
          // Regular text - split by newlines and bold markers
          return (
            <span key={i} className="whitespace-pre-wrap break-words">
              {part.split(/(\*\*.*?\*\*)/g).map((segment, j) => {
                if (segment.startsWith("**") && segment.endsWith("**")) {
                  return (
                    <strong key={j} className="font-semibold">
                      {segment.slice(2, -2)}
                    </strong>
                  );
                }
                return segment;
              })}
            </span>
          );
        })}
      </div>
    </div>
  );
}
