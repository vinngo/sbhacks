import { NextRequest } from 'next/server'
import { USE_MOCK_DATA } from '@/lib/mock-data'
import { addDays, setHours, setMinutes, startOfWeek } from 'date-fns'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

// Helper to create dates for mock response
function createMockDate(dayOffset: number, hour: number, minute: number = 0): string {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 })
  return setMinutes(setHours(addDays(weekStart, dayOffset), hour), minute).toISOString()
}

// Mock streaming response
async function* mockChatStream(): AsyncGenerator<string> {
  const response = `I'll analyze your calendar and find the best times for your tasks.

Looking at your schedule, I can see you have several existing commitments. Here are my suggestions:

\`\`\`json
[
  {
    "id": "proposed-${Date.now()}",
    "taskId": "task-1",
    "title": "Focus Work",
    "start": "${createMockDate(1, 10, 0)}",
    "end": "${createMockDate(1, 12, 0)}",
    "status": "proposed",
    "reasoning": "Monday morning has a clear 2-hour block after your standup"
  },
  {
    "id": "proposed-${Date.now() + 1}",
    "taskId": "task-2",
    "title": "Review Session",
    "start": "${createMockDate(3, 9, 0)}",
    "end": "${createMockDate(3, 10, 30)}",
    "status": "proposed",
    "reasoning": "Wednesday morning before your gym session ends"
  }
]
\`\`\`

I've scheduled **Focus Work** for Monday 10 AM - 12 PM, giving you a solid 2-hour block for deep work right after your team standup.

**Review Session** is placed on Wednesday 9 - 10:30 AM, taking advantage of the morning slot.

Feel free to drag these events to different times, or let me know if you'd prefer different slots!`

  // Stream response word by word
  const words = response.split(' ')
  for (const word of words) {
    yield word + ' '
    await new Promise(resolve => setTimeout(resolve, 25))
  }
}

// POST /api/chat - Stream chat response
export async function POST(request: NextRequest) {
  const body = await request.json()

  if (USE_MOCK_DATA) {
    // Return streaming mock response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of mockChatStream()) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  }

  try {
    // Proxy to FastAPI backend
    const response = await fetch(`${FASTAPI_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.status}`)
    }

    // Stream the response back
    if (response.body) {
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      })
    }

    throw new Error('No response body')
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Sorry, I encountered an error. Please try again.', {
      status: 500,
    })
  }
}
