from fastapi import APIRouter, HTTPException

from app.schemas import (
    TutorRequest,
    TutorResponse
)

from app.services.tutor import run_tutor


router = APIRouter(
    prefix="/tutor",
    tags=["tutor"]
)


@router.post(
    "/chat",
    response_model=TutorResponse
)
def tutor_chat(
    request: TutorRequest
):

    try:

        result = run_tutor(
            learner=request.learner,
            message=request.message,
            scenario_id=request.scenario_id,
            conversation=request.conversation
        )

        return TutorResponse(
            **result
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )