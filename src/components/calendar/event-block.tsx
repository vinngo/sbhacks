"use client";

import { useState, useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn, formatTime, getEventPosition } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/types";
import { GripVertical } from "lucide-react";

type EventBlockProps = {
  event: CalendarEvent;
  dayStartHour?: number;
  onResize?: (eventId: string, newStart: Date, newEnd: Date) => void;
};

// Height threshold for compact mode (in pixels)
const COMPACT_HEIGHT_THRESHOLD = 35;
const PIXELS_PER_HOUR = 60;
const PIXELS_PER_15_MIN = 15; // 15 pixels = 15 minutes
const MIN_HEIGHT = PIXELS_PER_15_MIN; // Minimum 15 minutes

// Spring config for smooth animations
const springConfig = { stiffness: 500, damping: 30, mass: 0.5 };

// Snap value to nearest 15-minute increment (15 pixels)
const snapTo15Min = (value: number): number => {
  return Math.round(value / PIXELS_PER_15_MIN) * PIXELS_PER_15_MIN;
};

export function EventBlock({ event, dayStartHour = 6, onResize }: EventBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{
    edge: "top" | "bottom";
    startY: number;
    initialTop: number;
    initialHeight: number;
  } | null>(null);

  const { top, height } = getEventPosition(
    event.start,
    event.end,
    dayStartHour,
  );

  // Motion values for smooth animation
  const motionTop = useMotionValue(top);
  const motionHeight = useMotionValue(height);
  
  // Spring-animated values for extra smoothness
  const springTop = useSpring(motionTop, springConfig);
  const springHeight = useSpring(motionHeight, springConfig);

  // Update motion values when event changes (not during resize)
  useEffect(() => {
    if (!isResizing) {
      motionTop.set(top);
      motionHeight.set(height);
    }
  }, [top, height, isResizing, motionTop, motionHeight]);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `existing-${event.id}`,
      data: { event, isExisting: true },
      disabled: isResizing,
    });

  const isCompact = height < COMPACT_HEIGHT_THRESHOLD;

  // Handle resize mouse events
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      
      const deltaY = e.clientY - resizeRef.current.startY;

      if (resizeRef.current.edge === "top") {
        // Snap to 15-minute increments
        const rawTop = resizeRef.current.initialTop + deltaY;
        const rawHeight = resizeRef.current.initialHeight - deltaY;
        
        const snappedTop = snapTo15Min(rawTop);
        const snappedHeight = snapTo15Min(rawHeight);
        
        if (snappedHeight >= MIN_HEIGHT) {
          motionTop.set(snappedTop);
          motionHeight.set(snappedHeight);
        }
      } else {
        // Snap to 15-minute increments
        const rawHeight = resizeRef.current.initialHeight + deltaY;
        const snappedHeight = snapTo15Min(rawHeight);
        
        if (snappedHeight >= MIN_HEIGHT) {
          motionHeight.set(snappedHeight);
        }
      }
    };

    const handleMouseUp = () => {
      if (onResize && resizeRef.current) {
        // Get snapped values
        const currentTop = snapTo15Min(motionTop.get());
        const currentHeight = snapTo15Min(motionHeight.get());
        
        // Calculate time changes (15 pixels = 15 minutes = 15 * 60 * 1000 ms)
        const topDeltaMs = ((currentTop - top) / PIXELS_PER_15_MIN) * 15 * 60 * 1000;
        const heightDeltaMs = ((currentHeight - height) / PIXELS_PER_15_MIN) * 15 * 60 * 1000;

        const newStart = new Date(event.start.getTime() + topDeltaMs);
        const newEnd = new Date(event.end.getTime() + topDeltaMs + heightDeltaMs);

        // Round to nearest 15 minutes for clean times
        newStart.setMinutes(Math.round(newStart.getMinutes() / 15) * 15, 0, 0);
        newEnd.setMinutes(Math.round(newEnd.getMinutes() / 15) * 15, 0, 0);

        onResize(event.id, newStart, newEnd);
      }

      resizeRef.current = null;
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, motionTop, motionHeight, top, height, event, onResize]);

  const handleResizeStart = (edge: "top" | "bottom") => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    resizeRef.current = {
      edge,
      startY: e.clientY,
      initialTop: motionTop.get(),
      initialHeight: motionHeight.get(),
    };
    setIsResizing(true);
  };

  return (
    <motion.div
      ref={setNodeRef}
      className={cn(
        "absolute left-1 right-1 rounded-md px-2 group",
        "bg-gray-200 text-foreground",
        "text-[10px] font-medium overflow-hidden",
        "border border-border",
        isCompact ? "py-0.5 flex items-center" : "py-1",
        isDragging && "opacity-50 z-50 cursor-grabbing",
        isResizing && "z-50 ring-2 ring-primary/50",
        !isResizing && "cursor-grab",
      )}
      style={{
        top: springTop,
        height: springHeight,
        transform: isResizing ? undefined : CSS.Transform.toString(transform),
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        boxShadow: isHovered || isResizing
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
          : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        scale: isResizing ? 1.02 : 1,
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      {...attributes}
      {...(isResizing ? {} : listeners)}
    >
      {/* Top resize handle */}
      <motion.div
        className={cn(
          "absolute -top-1 left-0 right-0 h-4 cursor-ns-resize z-10",
          "flex items-center justify-center",
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered || isResizing ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        onMouseDown={handleResizeStart("top")}
      >
        <motion.div 
          className="w-10 h-1.5 bg-gray-400 rounded-full"
          whileHover={{ scale: 1.2, backgroundColor: "#6b7280" }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>

      {isCompact ? (
        // Compact horizontal layout for small blocks
        <div className="flex items-center gap-1 w-full min-w-0">
          <GripVertical className="h-3 w-3 flex-shrink-0 opacity-50" />
          <span className="font-semibold truncate">{event.title}</span>
          <span className="opacity-75 flex-shrink-0">
            {formatTime(event.start)}
          </span>
        </div>
      ) : (
        // Standard vertical layout for larger blocks
        <div className="flex items-start gap-1">
          <GripVertical className="h-3 w-3 flex-shrink-0 opacity-50 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold break-words">{event.title}</div>
            <div className="opacity-75">
              {formatTime(event.start)} – {formatTime(event.end)}
            </div>
          </div>
        </div>
      )}

      {/* Bottom resize handle */}
      <motion.div
        className={cn(
          "absolute -bottom-1 left-0 right-0 h-4 cursor-ns-resize z-10",
          "flex items-center justify-center",
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered || isResizing ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        onMouseDown={handleResizeStart("bottom")}
      >
        <motion.div 
          className="w-10 h-1.5 bg-gray-400 rounded-full"
          whileHover={{ scale: 1.2, backgroundColor: "#6b7280" }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>
    </motion.div>
  );
}
