from fastapi import APIRouter
from pydantic import BaseModel

from app.models import Message, SchedulerState

router = APIRouter()


class ChatRequest(BaseModel):
    messages: list[Message]
    proposal_state: SchedulerState


@router.post("/")
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
    
    return {
        "messages": request.messages,
        "proposal_state": request.proposal_state,
    }
