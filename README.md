# Kairo: An Intelligent Schedule Optimizer

A calendar scheduling application inspired by Cursor; built with Next.js and FastAPI that uses AI to optimize your schedule. The app integrates with Google Calendar and uses LangChain with Google Gemini 3 Flash to provide smart scheduling suggestions through a chat interface.

## Project Structure

```
sbhacks/
├── src/                          # Next.js frontend source
│   ├── app/                      # Next.js app router pages
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── providers.tsx        # React providers (QueryClient, etc.)
│   ├── components/              # React components
│   │   ├── auth/                # Authentication components
│   │   ├── calendar/            # Calendar view components
│   │   ├── chat/                # Chat interface components
│   │   ├── shared/              # Shared UI components
│   │   └── ui/                  # UI primitives (shadcn/ui)
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-calendar.ts     # Calendar data management
│   │   ├── use-chat.ts         # Chat functionality
│   │   └── use-scheduler.ts    # Scheduling logic
│   ├── lib/                     # Utility libraries
│   │   ├── api.ts              # API client functions
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── types.ts            # TypeScript type definitions
│   │   └── utils.ts            # Helper utilities
│   ├── context/                 # React context providers
│   │   └── scheduler-context.tsx
│   └── types/                   # Additional TypeScript types
│       └── next-auth.d.ts      # NextAuth type extensions
│
├── fastapi/                     # Backend API
│   ├── app/                     # FastAPI application
│   │   ├── routes/             # API route handlers
│   │   │   ├── calendar.py     # Calendar endpoints
│   │   │   └── chat.py         # Chat/AI endpoints
│   │   ├── agent.py            # LangChain AI agent logic
│   │   └── models.py           # Pydantic data models
│   ├── google-calendar-mcp/    # Google Calendar MCP server
│   │   └── src/                # MCP server source code
│   ├── main.py                 # FastAPI app entry point
│   ├── requirements.txt        # Python dependencies
│   └── README.md               # Backend-specific docs
│
├── public/                      # Static assets
├── .env.local                   # Environment variables (frontend)
├── package.json                 # Node.js dependencies
├── tsconfig.json                # TypeScript configuration
└── next.config.ts               # Next.js configuration
```

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **NextAuth.js** - Authentication with Google OAuth
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI component library
- **Framer Motion** - Animations
- **date-fns** - Date manipulation
- **@dnd-kit** - Drag and drop functionality

### Backend
- **FastAPI** - Python web framework
- **LangChain** - AI/LLM orchestration framework
- **LangGraph** - Agent workflow management
- **Google Gemini** - AI language model
- **MCP (Model Context Protocol)** - Google Calendar integration
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

## Prerequisites

- **Node.js** 20.x or later
- **Python** 3.12 or later
- **Google Cloud Project** with OAuth credentials configured
- **npm**, **yarn**, **pnpm**, or **bun** package manager

## Getting Started

### 1. Frontend Setup (Next.js)

#### Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

#### Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Credentials
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

To generate a `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

#### Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

### 2. Backend Setup (FastAPI)

Navigate to the `fastapi` directory:
```bash
cd fastapi
```

#### Create Virtual Environment
```bash
# Linux/Mac
python3 -m venv sbhacksvenv
source sbhacksvenv/bin/activate

# Windows
python -m venv sbhacksvenv
sbhacksvenv\Scripts\activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
# or on Mac
pip3 install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in `fastapi/app/`:

```env
# Add your API keys and configuration here
GOOGLE_API_KEY=your-gemini-api-key
```

#### Run FastAPI Server
```bash
uvicorn main:app --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000)

API documentation is available at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 3. Google Calendar MCP Server Setup

Navigate to the MCP server directory:
```bash
cd fastapi/google-calendar-mcp
```

#### Install Dependencies
```bash
npm install
```

#### Build the MCP Server
```bash
npm run build
```

#### Configure MCP Environment
Create a `.env` file based on `.env.example`:

```env
TRANSPORT=http
PORT=8080
HOST=127.0.0.1
GOOGLE_OAUTH_CREDENTIALS=./gcp-oauth.keys.json
```

#### Set Up Google OAuth Credentials
1. Copy the example credentials file:
   ```bash
   cp gcp-oauth.keys.example.json gcp-oauth.keys.json
   ```

2. Replace the contents with your actual Google OAuth credentials from the Google Cloud Console

#### Authenticate with Google
```bash
npm run auth
```
This will open a browser window for you to authorize the application with your Google account.

#### Run the MCP Server
```bash
node build/index.js --transport http --port 8080
```

The MCP server will listen on port 8080 and provide Google Calendar integration for the AI agent.

## Development Workflow

1. Start the **MCP server** (port 8080):
   ```bash
   cd fastapi/google-calendar-mcp
   node build/index.js --transport http --port 8080
   ```

2. Start the **FastAPI backend** (port 8000):
   ```bash
   cd fastapi
   source sbhacksvenv/bin/activate  # or activate on Windows
   uvicorn main:app --reload
   ```

3. Start the **Next.js frontend** (port 3000):
   ```bash
   npm run dev
   ```

All three services need to be running for the full application to work.

## Features

- **Google Calendar Integration** - View and manage your Google Calendar events
- **AI-Powered Scheduling** - Chat with an AI agent to optimize your schedule
- **Drag & Drop Interface** - Intuitive calendar event management
- **Smart Suggestions** - Get intelligent scheduling recommendations
- **OAuth Authentication** - Secure login with Google
- **Real-time Updates** - Live calendar synchronization

## API Endpoints

### Calendar Routes (`/api/calendar`)
- `GET /api/calendar/events` - Fetch calendar events
- `POST /api/calendar/events` - Create new event
- `PUT /api/calendar/events/{id}` - Update event
- `DELETE /api/calendar/events/{id}` - Delete event

### Chat Routes (`/api/chat`)
- `POST /api/chat` - Send message to AI scheduling assistant
- `GET /api/chat/history` - Retrieve chat history

## Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `uvicorn main:app --reload` - Start development server
- `ruff check .` - Run linter

## Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Download the credentials and use them in your `.env.local` file

## Troubleshooting

- If you encounter CORS issues, ensure the FastAPI CORS middleware allows `http://localhost:3000`
- Make sure all three services (Next.js, FastAPI, MCP server) are running
- Verify all environment variables are correctly set
- Check that Google OAuth credentials are valid and not expired

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [LangChain Documentation](https://python.langchain.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
