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

SYSTEM_PROMPT = """You are a helpful assistant with access to specialized tools.

Your capabilities include:
Performing mathematical calculations
Checking weather information

Guidelines:
Be concise and accurate in your responses
Use the appropriate tool when needed
Explain your reasoning when performing calculations
Provide complete information when asked about weather
"""

async def create_my_agent():
    tools = await client.get_tools()


    llm = ChatOpenAI(
        model="google/gemini-3-flash-preview",
        api_key=os.getenv("OPENROUTER_API_KEY"),
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
