from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from arch.api.schemas import AnswerUpdate, FeedbackUpdate, StatusUpdate, TokenRequest
from arch.use_cases.answer_updater import AnswerUpdaterAsyncUseCase
from arch.use_cases.review_updater import ReviewUpdaterAsyncUseCase
from arch.use_cases.room_detail import RoomDetailAsyncUseCase
from arch.use_cases.room_status_updater import RoomStatusUpdaterAsyncUseCase
from settings.db import get_session

router = APIRouter(prefix="/api/v1")


@router.post("/validate-token/")
async def validate_token(
    request: TokenRequest,
    session: AsyncSession = Depends(get_session),
):
    token = request.token
    use_case = RoomDetailAsyncUseCase(session, token=token)

    try:
        room = await use_case.execute(False)
        if room:
            return {"room": room, "role": "candidate", "token": token}

        room = await use_case.execute(True)
        if room:
            return {"room": room, "role": "reviewer", "token": token}
    except Exception as exc:
        print(exc)
        raise HTTPException(status_code=404, detail="Invalid token") from exc


@router.get("/room/{token}/")
async def get_room(
    token: str,
    is_reviewer: bool = False,
    session: AsyncSession = Depends(get_session),
):
    use_case = RoomDetailAsyncUseCase(session, token=token)

    try:
        return await use_case.execute(is_reviewer)
    except Exception as exc:
        raise HTTPException(status_code=404, detail="Room not found") from exc


@router.put("/answer/{answer_id}/")
async def update_answer(
    answer_id: int,
    update: AnswerUpdate,
    session: AsyncSession = Depends(get_session),
):
    use_case = AnswerUpdaterAsyncUseCase(
        session, answer_id=answer_id, answer=update.candidate_answer
    )
    try:
        await use_case.execute()
        return {"success": True}
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Failed to update answer") from exc


@router.put("/answer/{answer_id}/feedback/")
async def update_feedback(
    answer_id: int,
    update: FeedbackUpdate,
    session: AsyncSession = Depends(get_session),
):
    use_case = ReviewUpdaterAsyncUseCase(
        session, answer_id=answer_id, review=update.reviewer_comment, mark=update.mark
    )
    try:
        await use_case.execute()
        return {"success": True}
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail="Failed to update feedback"
        ) from exc


@router.put("/room/{room_id}/status/")
async def update_status(
    room_id: int,
    update: StatusUpdate,
    session: AsyncSession = Depends(get_session),
):
    use_case = RoomStatusUpdaterAsyncUseCase(
        session, room_id=room_id, status=update.status
    )
    try:
        await use_case.execute()
        return {"success": True}
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail="Failed to update room status"
        ) from exc
