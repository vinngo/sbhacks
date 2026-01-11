from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
import os


client = MultiServerMCPClient(
    {
        "google_calendar": {
            "transport": "streamable_http",  # HTTP-based remote server
            # Ensure you start your weather server on port 8000
            "url": "http://localhost:8080",
        }

    }
)

SYSTEM_PROMPT = """You are an intelligent calendar scheduling assistant. Your goal is to help users optimize their schedule for productivity AND well-being.

## Your Capabilities
- View and analyze the user's existing Google Calendar events
- Create, modify, and remove calendar events
- Suggest optimal time slots based on the user's preferences and existing commitments

## Scheduling Philosophy
1. **Balance is key**: A good schedule includes focused work blocks AND rest periods
2. **Context matters**: Consider time of day (e.g., coding in the morning vs. meetings in the afternoon)
3. **Buffer time**: Always leave small gaps between events for transitions
4. **User autonomy**: Present suggestions, but let the user decide

## How to Handle Common Scenarios

### When scheduling a new task (e.g., "I need 3 hours to code"):
- Find the best available time slot considering the user's energy patterns
- Suggest specific times with brief reasoning
- Ask about preferences if multiple good options exist

### When a user cancels/drops a plan:
- Acknowledge the freed-up time
- Ask: "Would you like to keep this time free for flexibility, fill it with another task, or use it for a break?"
- Don't automatically fill the gap without asking

### When a user adds a new commitment:
- Check for conflicts with existing events
- If conflicts exist, propose rescheduling options
- Ask which existing events can be moved vs. which are fixed

### When the schedule is too packed:
- Proactively warn: "Your schedule looks quite full. This might lead to burnout."
- Suggest specific events that could be moved to another day
- Recommend adding breaks or buffer time
- Never schedule back-to-back events for more than 4 hours

### When the schedule has large gaps:
- Suggest productive activities or rest based on user's goals
- Offer to add focus blocks, exercise, meals, or wind-down time
- Ask about their priorities before filling gaps

## Response Style
- Be conversational but concise
- Always explain your reasoning briefly
- Present options rather than dictating
- Use time formats the user can easily understand (e.g., "2:00 PM - 5:00 PM")
- Confirm before making any changes to the calendar
"""

async def create_my_agent():
    tools = await client.get_tools()


    llm = ChatOpenAI(
        model="google/gemini-3-flash-preview",
        api_key=os.getenv("OPENROUTER_API_KEY")
        openai_api_base="https://openrouter.ai/api/v1",
        temperature=0.7
    )



    # Initialize Gemini Flash 3.0 Preview model


    agent = create_react_agent(
        llm,
        tools,
        prompt=SYSTEM_PROMPT
    )

    return agent

# Cached agent instance
_agent = None

async def get_agent():
    """Get or create the agent instance."""
    global _agent
    if _agent is None:
        _agent = await create_my_agent()
    return _agent

async def run_agent_with_history(messages: list[dict]) -> str:
    """
    Run the agent with conversation history.

    Args:
        messages: List of message dicts with 'role' and 'content'

    Returns:
        The agent's response as a string
    """
    agent = await get_agent()

    result = await agent.ainvoke({"messages": messages})

    # Extract the last AI message
    if "messages" in result:
        for msg in reversed(result["messages"]):
            if hasattr(msg, "content") and getattr(msg, "type", None) == "ai":
                return msg.content

    return "No response generated"

async def get_calendar_events(start: str, end: str) -> dict:
    """
    Fetch calendar events using the MCP tools.

    Args:
        start: Start date in ISO format
        end: End date in ISO format

    Returns:
        Dict with response and raw result
    """
    agent = await get_agent()

    prompt = f"List all calendar events between {start} and {end}. Return the events as a structured list."

    result = await agent.ainvoke({
        "messages": [{"role": "user", "content": prompt}]
    })

    # The agent will use MCP tools to fetch events
    if "messages" in result:
        for msg in reversed(result["messages"]):
            if hasattr(msg, "content") and getattr(msg, "type", None) == "ai":
                return {"response": msg.content, "raw": result}

    return {"response": "", "raw": result}

async def create_calendar_event(summary: str, start: str, end: str, description: str = "") -> dict:
    """
    Create a calendar event using the MCP tools.

    Args:
        summary: Event title/summary
        start: Start datetime in ISO format
        end: End datetime in ISO format
        description: Optional event description

    Returns:
        Dict with response and raw result
    """
    agent = await get_agent()

    prompt = f"Create a calendar event with title '{summary}' starting at {start} and ending at {end}."
    if description:
        prompt += f" Description: {description}"

    result = await agent.ainvoke({
        "messages": [{"role": "user", "content": prompt}]
    })

    if "messages" in result:
        for msg in reversed(result["messages"]):
            if hasattr(msg, "content") and getattr(msg, "type", None) == "ai":
                return {"response": msg.content, "raw": result}

    return {"response": "", "raw": result}
