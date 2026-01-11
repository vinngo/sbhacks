from fastapi import APIRouter, Query
from pydantic import BaseModel
from datetime import datetime

from app.models import CalendarEvent, ProposedEvent
from app.agent import get_calendar_events as fetch_events, create_calendar_event

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

    # Fetch events from Google Calendar API using MCP
    result = await fetch_events(start, end)
    # Parse the agent's response to extract events
    # For now, return empty array until response parsing is implemented
    events: list[CalendarEvent] = []

    return events


