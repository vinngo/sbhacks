from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_calendar():
    return {"message": "Calendar endpoint"}
