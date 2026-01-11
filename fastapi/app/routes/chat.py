from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uuid
import asyncio

from app.models import Message, SchedulerState
from app.agent import run_agent_with_history

router = APIRouter()


class ChatRequest(BaseModel):
    messages: list[Message]
    proposal_state: SchedulerState


async def generate_response(message_history: list[dict]):
    """Stream the agent response word by word."""
    # Get agent response
    agent_response = await run_agent_with_history(message_history)

    # Stream the response word by word
    words = agent_response.split(' ')
    for word in words:
        yield word + ' '
        await asyncio.sleep(0.02)  # Small delay for streaming effect


@router.post("/") #localhost:8000/api/chat
async def chat(request: ChatRequest):
    """
    Handle chat messages with the scheduling agent.

    Input: messages: Message[], proposalState: SchedulerState
    Output: Streaming text response
    """
    # Convert Message objects to dict format expected by agent
    message_history = [
        {"role": msg.role, "content": msg.content}
        for msg in request.messages
    ]

    # Return streaming response
    return StreamingResponse(
        generate_response(message_history),
        media_type="text/plain"
    )
