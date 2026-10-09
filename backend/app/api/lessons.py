from fastapi import APIRouter

from app.data import load_scenarios


router = APIRouter(
    prefix="/lessons",
    tags=["lessons"]
)


@router.get("")
def lessons():

    return {
        "lessons": load_scenarios()
    }