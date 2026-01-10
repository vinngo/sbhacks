"use client";

import { Button } from "@/components/ui/button";
import { useScheduler } from "@/hooks/use-scheduler";
import { useCommitEvents } from "@/hooks/use-calendar";
import { useSchedulerContext } from "@/context/scheduler-context";
import { Check, X, Loader2 } from "lucide-react";

export function ActionBar() {
  const { proposedEvents, hasProposals, clearProposals } = useScheduler();
  const { status } = useSchedulerContext();
  const commitMutation = useCommitEvents();

  const isCommitting = status === "committing";
  const uncommittedEvents = proposedEvents.filter(
    (e) => e.status !== "committed",
  );
  const hasUncommitted = uncommittedEvents.length > 0;

  const handleAccept = () => {
    if (uncommittedEvents.length > 0) {
      commitMutation.mutate(uncommittedEvents);
    }
  };

  const handleCancel = () => {
    clearProposals();
  };

  if (!hasProposals) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-background">
      <div className="text-sm text-muted-foreground">
        {hasProposals ? (
          <>
            {uncommittedEvents.length} event
            {uncommittedEvents.length !== 1 ? "s" : ""} to schedule
          </>
        ) : (
          "No events proposed yet"
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={!hasProposals || isCommitting}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleAccept}
          disabled={!hasUncommitted || isCommitting}
        >
          {isCommitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Accept Schedule
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
