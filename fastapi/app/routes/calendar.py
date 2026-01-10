from fastapi import APIRouter, Query
from pydantic import BaseModel
from datetime import datetime

from app.models import CalendarEvent, ProposedEvent

router = APIRouter()


class CalendarPostRequest(BaseModel):
    proposed_events: list[ProposedEvent]


class CalendarPostResponse(BaseModel):
    created_events: list[CalendarEvent]
    errors: list[str]


@router.get("/", response_model=list[CalendarEvent])
async def get_calendar_events(
    start: str = Query(..., description="Start date in ISO format"),
    end: str = Query(..., description="End date in ISO format"),
):
    """
    Fetch calendar events for a date range.
    
    Input: start, end (ISO strings)
    Output: array of CalendarEvent
    """
    # Parse the ISO date strings
    start_date = datetime.fromisoformat(start.replace("Z", "+00:00"))
    end_date = datetime.fromisoformat(end.replace("Z", "+00:00"))
    
    # TODO: Fetch events from Google Calendar API using MCP
    # For now, return empty array
    events: list[CalendarEvent] = []
    
    return events


@router.post("/", response_model=CalendarPostResponse)
async def create_calendar_events(request: CalendarPostRequest):
    """
    Create calendar events from proposed events.
    
    Input: array of ProposedEvent
    Output: array of created CalendarEvent, array of errors
    """
    created_events: list[CalendarEvent] = []
    errors: list[str] = []
    
    for proposed in request.proposed_events:
        try:
            # TODO: Create event in Google Calendar via MCP
            # For now, convert proposed event to calendar event
            calendar_event = CalendarEvent(
                id=proposed.id,
                title=proposed.title,
                start=proposed.start,
                end=proposed.end,
            )
            created_events.append(calendar_event)
        except Exception as e:
            errors.append(f"Failed to create event '{proposed.title}': {str(e)}")
    
    return CalendarPostResponse(
        created_events=created_events,
        errors=errors,
    )
