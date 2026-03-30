from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from arch.api.schemas import (
    AnswerUpdate,
    FeedbackUpdate,
    RoomCreate,
    RoomUpdate,
    SectionCreate,
    SectionUpdate,
    StatusUpdate,
    TaskCreate,
    TaskUpdate,
    TemplateCreate,
    TemplateUpdate,
    TokenRequest,
)
from arch.dtos.rooms import RoomCreateDTO
from arch.models import ArchRoomAnswers, ArchRooms, ArchTasks, Sections, Templates
from arch.repositories.room_answers import RoomAnswersRepository
from arch.repositories.sections import SectionsRepository
from arch.use_cases.answer_updater import AnswerUpdaterAsyncUseCase
from arch.use_cases.review_updater import ReviewUpdaterAsyncUseCase
from arch.use_cases.room_creator import RoomCreatorAsyncUseCase
from arch.use_cases.room_detail import RoomDetailAsyncUseCase
from arch.use_cases.room_status_updater import RoomStatusUpdaterAsyncUseCase
from settings.db import get_session

router = APIRouter(prefix='/api/v1')


@router.post('/validate-token/')
async def validate_token(
    request: TokenRequest,
    session: AsyncSession = Depends(get_session),
):
    token = request.token
    use_case = RoomDetailAsyncUseCase(session, token=token)

    try:
        room = await use_case.execute(False)
        if room:
            return {'room': room, 'role': 'candidate', 'token': token}

        room = await use_case.execute(True)
        if room:
            return {'room': room, 'role': 'reviewer', 'token': token}
    except Exception as exc:
        print(exc)
        raise HTTPException(status_code=404, detail='Invalid token') from exc


@router.get('/room/{token}/')
async def get_room(
    token: str,
    is_reviewer: bool = False,
    session: AsyncSession = Depends(get_session),
):
    use_case = RoomDetailAsyncUseCase(session, token=token)
    try:
        return await use_case.execute(is_reviewer)
    except Exception as exc:
        raise HTTPException(status_code=404, detail='Room not found') from exc


@router.put('/answer/{answer_id}/')
async def update_answer(
    answer_id: int,
    update: AnswerUpdate,
    session: AsyncSession = Depends(get_session),
):
    use_case = AnswerUpdaterAsyncUseCase(session, answer_id=answer_id, answer=update.candidate_answer)
    try:
        await use_case.execute()
        return {'success': True}
    except Exception as exc:
        raise HTTPException(status_code=500, detail='Failed to update answer') from exc


@router.put('/answer/{answer_id}/feedback/')
async def update_feedback(
    answer_id: int,
    update: FeedbackUpdate,
    session: AsyncSession = Depends(get_session),
):
    use_case = ReviewUpdaterAsyncUseCase(session, answer_id=answer_id, review=update.reviewer_comment, mark=update.mark)
    try:
        await use_case.execute()
        return {'success': True}
    except Exception as exc:
        raise HTTPException(status_code=500, detail='Failed to update feedback') from exc


@router.put('/room/{room_id}/status/')
async def update_status(
    room_id: int,
    update: StatusUpdate,
    session: AsyncSession = Depends(get_session),
):
    use_case = RoomStatusUpdaterAsyncUseCase(session, room_id=room_id, status=update.status)
    try:
        await use_case.execute()
        return {'success': True}
    except Exception as exc:
        raise HTTPException(status_code=500, detail='Failed to update room status') from exc


# ── Tasks CRUD ───────────────────────────────────────────────────────────────

@router.get('/tasks/')
async def list_tasks(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(ArchTasks).order_by(ArchTasks.id.desc()))
    return result.scalars().all()


@router.get('/tasks/{task_id}/')
async def get_task(task_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(ArchTasks).where(ArchTasks.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail='Task not found')
    return task


@router.post('/tasks/', status_code=201)
async def create_task(body: TaskCreate, session: AsyncSession = Depends(get_session)):
    task = ArchTasks(**body.model_dump())
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


@router.put('/tasks/{task_id}/')
async def update_task(task_id: int, body: TaskUpdate, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(ArchTasks).where(ArchTasks.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail='Task not found')
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    await session.commit()
    await session.refresh(task)
    return task


@router.delete('/tasks/{task_id}/')
async def delete_task(task_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(ArchTasks).where(ArchTasks.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail='Task not found')
    await session.delete(task)
    await session.commit()
    return {'success': True}


# ── Templates CRUD ───────────────────────────────────────────────────────────

@router.get('/templates/')
async def list_templates(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Templates).options(selectinload(Templates.sections)).order_by(Templates.id.desc())
    )
    return result.scalars().all()


@router.get('/templates/{template_id}/')
async def get_template(template_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Templates).options(selectinload(Templates.sections)).where(Templates.id == template_id)
    )
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail='Template not found')
    return template


@router.post('/templates/', status_code=201)
async def create_template(body: TemplateCreate, session: AsyncSession = Depends(get_session)):
    template = Templates(**body.model_dump())
    session.add(template)
    await session.commit()
    await session.refresh(template)
    return template


@router.put('/templates/{template_id}/')
async def update_template(template_id: int, body: TemplateUpdate, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Templates).where(Templates.id == template_id))
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail='Template not found')
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(template, field, value)
    await session.commit()
    await session.refresh(template)
    return template


@router.delete('/templates/{template_id}/')
async def delete_template(template_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Templates).where(Templates.id == template_id))
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail='Template not found')
    await session.delete(template)
    await session.commit()
    return {'success': True}


# ── Sections CRUD (under template) ───────────────────────────────────────────

@router.post('/templates/{template_id}/sections/', status_code=201)
async def create_section(template_id: int, body: SectionCreate, session: AsyncSession = Depends(get_session)):
    section = Sections(template_id=template_id, **body.model_dump())
    session.add(section)
    await session.commit()
    await session.refresh(section)
    return section


@router.put('/sections/{section_id}/')
async def update_section(section_id: int, body: SectionUpdate, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Sections).where(Sections.id == section_id))
    section = result.scalar_one_or_none()
    if not section:
        raise HTTPException(status_code=404, detail='Section not found')
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(section, field, value)
    await session.commit()
    await session.refresh(section)
    return section


@router.delete('/sections/{section_id}/')
async def delete_section(section_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Sections).where(Sections.id == section_id))
    section = result.scalar_one_or_none()
    if not section:
        raise HTTPException(status_code=404, detail='Section not found')
    await session.delete(section)
    await session.commit()
    return {'success': True}


# ── Rooms CRUD ───────────────────────────────────────────────────────────────

@router.get('/rooms/')
async def list_rooms(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(ArchRooms)
        .options(selectinload(ArchRooms.task), selectinload(ArchRooms.template))
        .order_by(ArchRooms.id.desc())
    )
    return result.scalars().all()


@router.get('/rooms/{room_id}/')
async def get_room_by_id(room_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(ArchRooms)
        .options(
            selectinload(ArchRooms.task),
            selectinload(ArchRooms.template),
            selectinload(ArchRooms.answers).selectinload(ArchRoomAnswers.section),
        )
        .where(ArchRooms.id == room_id)
    )
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail='Room not found')
    return room


@router.post('/rooms/', status_code=201)
async def create_room(body: RoomCreate, session: AsyncSession = Depends(get_session)):
    room_dto = RoomCreateDTO(
        name=body.name,
        description=body.description,
        task=body.task_id,
        template=body.template_id,
        started_at=body.started_at,
        ended_at=body.ended_at,
    )
    use_case = RoomCreatorAsyncUseCase(session, room_data=room_dto)
    await use_case.execute()
    result = await session.execute(
        select(ArchRooms)
        .options(selectinload(ArchRooms.task), selectinload(ArchRooms.template))
        .order_by(ArchRooms.id.desc())
    )
    return result.scalars().first()


@router.put('/rooms/{room_id}/')
async def update_room(room_id: int, body: RoomUpdate, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(ArchRooms).where(ArchRooms.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail='Room not found')
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(room, field, value)
    await session.commit()
    await session.refresh(room)
    return room


@router.delete('/rooms/{room_id}/')
async def delete_room(room_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(ArchRooms).where(ArchRooms.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail='Room not found')
    await session.delete(room)
    await session.commit()
    return {'success': True}


@router.post('/rooms/{room_id}/regenerate-answers/')
async def regenerate_room_answers(room_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(ArchRooms).where(ArchRooms.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail='Room not found')

    await session.execute(delete(ArchRoomAnswers).where(ArchRoomAnswers.room_id == room_id))
    await session.commit()

    section_repo = SectionsRepository(session)
    answer_repo = RoomAnswersRepository(session)
    sections = await section_repo.get_by_template_id(room.template_id)
    await answer_repo.add_for_room_sections(room_id, sections)

    return {'success': True, 'count': len(sections)}
