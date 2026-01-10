from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes import calendar, chat

load_dotenv()

app = FastAPI(title="Schedule Optimizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calendar.router, prefix="/api/calendar", tags=["calendar"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
