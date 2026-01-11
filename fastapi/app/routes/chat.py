from fastapi import APIRouter
from pydantic import BaseModel
import uuid

from app.models import Message, SchedulerState
from app.agent import run_agent_with_history

router = APIRouter()


class ChatRequest(BaseModel):
    messages: list[Message]
    proposal_state: SchedulerState


@router.post("/") #localhost:8000/api/chat
async def chat(request: ChatRequest):
    """
    Handle chat messages with the scheduling agent.
    
    Input: messages: Message[], proposalState: SchedulerState
    Output: Agent response with updated state
    """
    # TODO: Process messages through the LLM agent
    # The agent will:
    # 1. Analyze the conversation history
    # 2. Consider the current proposal state
    # 3. Generate scheduling proposals or responses

    # Convert Message objects to dict format expected by agent
    message_history = [
        {"role": msg.role, "content": msg.content}
        for msg in request.messages
    ]

    # Get agent response
    agent_response = await run_agent_with_history(message_history)

    # Create new message with agent response
    response_message = Message(
        id=str(uuid.uuid4()),
        role="assistant",
        content=agent_response
    )
    
    # Return updated messages and state
    return {
        "messages": request.messages + [response_message],
        "proposal_state": request.proposal_state,
    }
