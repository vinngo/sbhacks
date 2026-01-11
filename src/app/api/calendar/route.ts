import { NextRequest, NextResponse } from "next/server";
import { USE_MOCK_DATA, mockCalendarEvents } from "@/lib/mock-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/calendar - Fetch calendar events from Google Calendar API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (USE_MOCK_DATA) {
    // Return mock data with simulated delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    return NextResponse.json(mockCalendarEvents);
  }

  try {
    // Get the user's session and access token
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - no access token" },
        { status: 401 },
      );
    }

    const accessToken = session.accessToken;

    // First, get all calendars the user has access to
    const calendarsResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!calendarsResponse.ok) {
      const errorText = await calendarsResponse.text();
      console.error(
        "Failed to fetch calendars:",
        calendarsResponse.status,
        errorText,
      );
      throw new Error(
        `Failed to fetch calendars: ${calendarsResponse.statusText}`,
      );
    }

    const calendarsData = await calendarsResponse.json();
    const calendars = calendarsData.items || [];

    // Fetch events from each calendar
    const allEvents = [];

    for (const calendar of calendars) {
      const events = await fetchEventsForCalendar(
        accessToken,
        calendar.id,
        start,
        end,
      );
      allEvents.push(...events);
    }

    interface GoogleEvent {
      id: string;
      summary: string;
      start: {
        dateTime: string;
        date?: string;
      };
      end: {
        dateTime: string;
        date?: string;
      };
      source: string;
    }

    // Transform Google Calendar events to our CalendarEvent format
    const transformedEvents = allEvents.map((item: GoogleEvent) => ({
      id: item.id,
      title: item.summary || "Untitled Event",
      start: item.start.dateTime || item.start.date,
      end: item.end.dateTime || item.end.date,
      source: "google",
    }));

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 },
    );
  }
}

// POST /api/calendar - Commit proposed events to Google Calendar
export async function POST(request: NextRequest) {
  const events = await request.json();

  if (USE_MOCK_DATA) {
    // Simulate commit with delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock success response
    const created = events.map(
      (e: { id: string; title: string; start: string; end: string }) => ({
        id: `committed-${e.id}`,
        title: e.title,
        start: e.start,
        end: e.end,
        source: "google",
      }),
    );

    console.log("Mock commit:", created);
    return NextResponse.json({ created, errors: [] });
  }

  try {
    // Get the user's session and access token
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - no access token" },
        { status: 401 },
      );
    }

    const accessToken = session.accessToken;
    const created = [];
    const errors = [];

    // Create each event in Google Calendar
    for (const event of events) {
      try {
        const eventBody = {
          summary: event.title,
          start: {
            dateTime: event.start,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: event.end,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        };

        const response = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventBody),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to create event "${event.title}":`, errorText);
          errors.push(`Failed to create "${event.title}"`);
          continue;
        }

        const createdEvent = await response.json();
        created.push({
          id: createdEvent.id,
          title: createdEvent.summary,
          start: createdEvent.start.dateTime || createdEvent.start.date,
          end: createdEvent.end.dateTime || createdEvent.end.date,
          source: "google",
        });
      } catch (err) {
        console.error(`Error creating event "${event.title}":`, err);
        errors.push(`Failed to create "${event.title}"`);
      }
    }

    return NextResponse.json({ created, errors });
  } catch (error) {
    console.error("Calendar commit error:", error);
    return NextResponse.json(
      {
        error: "Failed to commit events",
        created: [],
        errors: ["Server error"],
      },
      { status: 500 },
    );
  }
}

// Helper function to fetch events for a specific calendar with pagination
async function fetchEventsForCalendar(
  accessToken: string,
  calendarId: string,
  start: string | null,
  end: string | null,
): Promise<[]> {
  let allEvents: any[] = [];
  let pageToken: string | null = null;

  do {
    const params = new URLSearchParams({
      singleEvents: "true",
      orderBy: "startTime",
    });

    if (start) params.append("timeMin", start);
    if (end) params.append("timeMax", end);
    if (pageToken) params.append("pageToken", pageToken);

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch events for calendar ${calendarId}:`,
        response.status,
      );
      // Skip this calendar if it fails (user might have lost access)
      break;
    }

    const data = await response.json();
    allEvents = allEvents.concat(data.items || []);
    pageToken = data.nextPageToken || null;
  } while (pageToken);

  return allEvents;
}
