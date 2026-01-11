"use client";

import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSchedulerContext } from "@/context/scheduler-context";
import { streamChat, parseProposedEvents } from "@/lib/api";
import { USE_MOCK_DATA, mockStreamChat } from "@/lib/mock-data";
import type { Message } from "@/lib/types";

export function useChat() {
  const queryClient = useQueryClient();
  const {
    messages,
    isStreaming,
    addMessage,
    updateLastMessage,
    setIsStreaming,
    setProposedEvents,
    setStatus,
    getProposalState,
  } = useSchedulerContext();

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      // Add user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };
      addMessage(userMessage);

      // Create placeholder for assistant response
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };
      addMessage(assistantMessage);

      setIsStreaming(true);
      setStatus("proposing");

      let fullContent = "";

      try {
        const state = getProposalState();
        const allMessages = [...messages, userMessage];

        // Use mock or real streaming
        const stream = USE_MOCK_DATA
          ? mockStreamChat()
          : streamChat(allMessages, {
              status: "proposing",
              existingEvents: state.existingEvents,
              proposedEvents: state.proposedEvents,
              tasks: state.tasks,
              messages: allMessages,
            });

        for await (const chunk of stream) {
          fullContent += chunk;
          updateLastMessage(fullContent);
        }

        // Parse proposed events from the completed response
        const proposedEvents = parseProposedEvents(fullContent);
        if (proposedEvents && proposedEvents.length > 0) {
          setProposedEvents(proposedEvents);
          setStatus("adjusting");
        } else {
          setStatus("idle");
        }

        // Refresh calendar data after each response
        queryClient.invalidateQueries({ queryKey: ["calendar"] });
      } catch (error) {
        console.error("Chat error:", error);
        updateLastMessage(
          fullContent || "Sorry, something went wrong. Please try again.",
        );
        setStatus("idle");
      } finally {
        setIsStreaming(false);
      }
    },
    [
      messages,
      isStreaming,
      addMessage,
      updateLastMessage,
      setIsStreaming,
      setProposedEvents,
      setStatus,
      getProposalState,
      queryClient,
    ],
  );

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, [setIsStreaming]);

  const clearMessages = useCallback(() => {
    // Note: This clears local state, would need context method to clear messages
  }, []);

  return {
    messages,
    isStreaming,
    sendMessage,
    cancelStream,
    clearMessages,
  };
}
