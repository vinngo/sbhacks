import { NextRequest, NextResponse } from "next/server";
import { USE_MOCK_DATA } from "@/lib/mock-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH /api/calendar/[eventId] - Update an existing calendar event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const updates = await request.json();

  if (USE_MOCK_DATA) {
    // Simulate update with delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log("Mock update event:", eventId, updates);
    return NextResponse.json({ success: true, eventId });
  }

  try {
    // Get the user's session and access token
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - no access token" },
        { status: 401 }
      );
    }

    const accessToken = session.accessToken;

    // Build the update body for Google Calendar API
    const eventBody: Record<string, unknown> = {};

    if (updates.start) {
      eventBody.start = {
        dateTime: updates.start,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }

    if (updates.end) {
      eventBody.end = {
        dateTime: updates.end,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }

    if (updates.title) {
      eventBody.summary = updates.title;
    }

    // Update the event using Google Calendar API
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update event ${eventId}:`, errorText);
      return NextResponse.json(
        { error: `Failed to update event: ${response.statusText}` },
        { status: response.status }
      );
    }

    const updatedEvent = await response.json();

    return NextResponse.json({
      success: true,
      event: {
        id: updatedEvent.id,
        title: updatedEvent.summary,
        start: updatedEvent.start.dateTime || updatedEvent.start.date,
        end: updatedEvent.end.dateTime || updatedEvent.end.date,
      },
    });
  } catch (error) {
    console.error("Calendar update error:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
