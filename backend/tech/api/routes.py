from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from settings.db import get_session
from tech.api.schemas import TechAnswerUpdate, TechFeedbackUpdate, TechStatusUpdate, TechTokenRequest
from tech.dto.room_answers import RoomAnswerUpdateDTO
from tech.models import TechRoomAnswers, TechRooms
from tech.use_cases.answer_updater import TechAnswerUpdaterUseCase
from tech.use_cases.room_detail import TechRoomDetailUseCase

router = APIRouter(prefix='/api/v1/tech')


@router.post('/validate-token/')
async def tech_validate_token(
    request: TechTokenRequest,
    session: AsyncSession = Depends(get_session),
):
    use_case = TechRoomDetailUseCase(session)

    room = await use_case.execute(request.token, False)
    if room:
        return {'room': room, 'role': 'candidate', 'token': request.token}

    room = await use_case.execute(request.token, True)
    if room:
        return {'room': room, 'role': 'reviewer', 'token': request.token}

    raise HTTPException(status_code=404, detail='Invalid token')


@router.get('/room/{token}/')
async def tech_get_room(
    token: str,
    is_reviewer: bool = False,
    session: AsyncSession = Depends(get_session),
):
    use_case = TechRoomDetailUseCase(session)
    room = await use_case.execute(token, is_reviewer)
    if not room:
        raise HTTPException(status_code=404, detail='Room not found')
    return room


@router.put('/answer/{answer_id}/')
async def tech_update_answer(
    answer_id: int,
    update: TechAnswerUpdate,
    session: AsyncSession = Depends(get_session),
):
    use_case = TechAnswerUpdaterUseCase(session)
    result = await use_case.execute(answer_id, RoomAnswerUpdateDTO(candidate_answer=update.candidate_answer))
    if not result:
        raise HTTPException(status_code=404, detail='Answer not found')
    return {'success': True}


@router.put('/answer/{answer_id}/feedback/')
async def tech_update_feedback(
    answer_id: int,
    update: TechFeedbackUpdate,
    session: AsyncSession = Depends(get_session),
):
    use_case = TechAnswerUpdaterUseCase(session)
    result = await use_case.execute(
        answer_id,
        RoomAnswerUpdateDTO(reviewer_comment=update.reviewer_comment, score=update.score),
    )
    if not result:
        raise HTTPException(status_code=404, detail='Answer not found')
    return {'success': True}


@router.put('/room/{room_id}/status/')
async def tech_update_room_status(
    room_id: int,
    update: TechStatusUpdate,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(TechRooms).where(TechRooms.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail='Room not found')
    room.status = update.status
    await session.commit()
    return {'success': True}
