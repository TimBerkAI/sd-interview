from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from settings.db import get_session
from tech.api.schemas import (
    TechAnswerUpdate,
    TechFeedbackUpdate,
    TechRoomCreate,
    TechRoomUpdate,
    TechStatusUpdate,
    TechTaskCreate,
    TechTaskUpdate,
    TechTokenRequest,
)
from tech.dto.room_answers import RoomAnswerUpdateDTO
from tech.models import TechRoomAnswers, TechRooms, TechTasks
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


# ── Tasks CRUD ────────────────────────────────────────────────────────────────

@router.get('/tasks/')
async def list_tech_tasks(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(TechTasks).order_by(TechTasks.id.desc()))
    return result.scalars().all()


@router.get('/tasks/{task_id}/')
async def get_tech_task(task_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(TechTasks).where(TechTasks.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail='Task not found')
    return task


@router.post('/tasks/', status_code=201)
async def create_tech_task(body: TechTaskCreate, session: AsyncSession = Depends(get_session)):
    task = TechTasks(**body.model_dump())
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


@router.put('/tasks/{task_id}/')
async def update_tech_task(task_id: int, body: TechTaskUpdate, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(TechTasks).where(TechTasks.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail='Task not found')
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    await session.commit()
    await session.refresh(task)
    return task


@router.delete('/tasks/{task_id}/')
async def delete_tech_task(task_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(TechTasks).where(TechTasks.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail='Task not found')
    await session.delete(task)
    await session.commit()
    return {'success': True}


# ── Rooms CRUD ────────────────────────────────────────────────────────────────

@router.get('/rooms/')
async def list_tech_rooms(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(TechRooms).options(selectinload(TechRooms.tasks)).order_by(TechRooms.id.desc())
    )
    return result.scalars().all()


@router.get('/rooms/{room_id}/')
async def get_tech_room_by_id(room_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(TechRooms)
        .options(
            selectinload(TechRooms.tasks),
            selectinload(TechRooms.answers).selectinload(TechRoomAnswers.task),
        )
        .where(TechRooms.id == room_id)
    )
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail='Room not found')
    return room


@router.post('/rooms/', status_code=201)
async def create_tech_room(body: TechRoomCreate, session: AsyncSession = Depends(get_session)):
    task_ids = body.task_ids
    room_data = body.model_dump(exclude={'task_ids'})
    room = TechRooms(**room_data)
    if task_ids:
        tasks_result = await session.execute(select(TechTasks).where(TechTasks.id.in_(task_ids)))
        room.tasks = list(tasks_result.scalars().all())
    session.add(room)
    await session.commit()
    await session.refresh(room)

    if task_ids:
        for order, task_id in enumerate(task_ids):
            answer = TechRoomAnswers(room_id=room.id, task_id=task_id, order=order)
            session.add(answer)
        await session.commit()

    result = await session.execute(
        select(TechRooms).options(selectinload(TechRooms.tasks)).where(TechRooms.id == room.id)
    )
    return result.scalar_one()


@router.put('/rooms/{room_id}/')
async def update_tech_room(room_id: int, body: TechRoomUpdate, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(TechRooms).options(selectinload(TechRooms.tasks)).where(TechRooms.id == room_id)
    )
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail='Room not found')

    data = body.model_dump(exclude_unset=True)
    task_ids = data.pop('task_ids', None)
    for field, value in data.items():
        setattr(room, field, value)

    if task_ids is not None:
        tasks_result = await session.execute(select(TechTasks).where(TechTasks.id.in_(task_ids)))
        room.tasks = list(tasks_result.scalars().all())

    await session.commit()
    await session.refresh(room)
    return room


@router.delete('/rooms/{room_id}/')
async def delete_tech_room(room_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(TechRooms).where(TechRooms.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail='Room not found')
    await session.delete(room)
    await session.commit()
    return {'success': True}


@router.post('/rooms/{room_id}/regenerate-answers/')
async def regenerate_tech_room_answers(room_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(TechRooms).options(selectinload(TechRooms.tasks)).where(TechRooms.id == room_id)
    )
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail='Room not found')

    await session.execute(delete(TechRoomAnswers).where(TechRoomAnswers.room_id == room_id))
    await session.commit()

    for order, task in enumerate(room.tasks):
        answer = TechRoomAnswers(room_id=room_id, task_id=task.id, order=order)
        session.add(answer)
    await session.commit()

    return {'success': True, 'count': len(room.tasks)}
