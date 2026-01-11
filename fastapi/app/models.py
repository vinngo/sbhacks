from pydantic import BaseModel
from datetime import datetime


class CalendarEvent(BaseModel):
    id: str
    title: str
    start: datetime
    end: datetime


class ProposedEvent(BaseModel):
    id: str
    task_id: str
    title: str
    start: datetime
    end: datetime
    status: str = "proposed"  # proposed | user-adjusted | committed
    reasoning: str | None = None


class Task(BaseModel):
    id: str
    title: str
    duration: int  # minutes
    deadline: datetime | None = None


class Message(BaseModel):
    id: str
    role: str  # user | assistant
    content: str


class SchedulerState(BaseModel):
    existing_events: list[CalendarEvent] = []
    tasks: list[Task] = []
    proposed_events: list[ProposedEvent] = []


class ChatRequest(BaseModel):
    messages: list[Message]
    proposal_state: SchedulerState
