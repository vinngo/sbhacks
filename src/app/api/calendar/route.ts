import { NextRequest, NextResponse } from 'next/server'
import { USE_MOCK_DATA, mockCalendarEvents } from '@/lib/mock-data'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

// GET /api/calendar - Fetch calendar events
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (USE_MOCK_DATA) {
    // Return mock data with simulated delay
    await new Promise(resolve => setTimeout(resolve, 200))
    return NextResponse.json(mockCalendarEvents)
  }

  try {
    // Proxy to FastAPI backend
    const response = await fetch(
      `${FASTAPI_URL}/api/calendar?start=${start}&end=${end}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Calendar API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    )
  }
}

// POST /api/calendar - Commit proposed events
export async function POST(request: NextRequest) {
  const events = await request.json()

  if (USE_MOCK_DATA) {
    // Simulate commit with delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Return mock success response
    const created = events.map((e: { id: string; title: string; start: string; end: string }) => ({
      id: `committed-${e.id}`,
      title: e.title,
      start: e.start,
      end: e.end,
      source: 'google',
    }))

    console.log('Mock commit:', created)
    return NextResponse.json({ created, errors: [] })
  }

  try {
    // Proxy to FastAPI backend
    const response = await fetch(`${FASTAPI_URL}/api/calendar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(events),
    })

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Calendar commit error:', error)
    return NextResponse.json(
      { error: 'Failed to commit events', created: [], errors: ['Server error'] },
      { status: 500 }
    )
  }
}
