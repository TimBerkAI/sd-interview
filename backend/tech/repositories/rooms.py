from sqlalchemy import select
from sqlalchemy.orm import selectinload
from tech.dto import RoomCreateDTO, RoomUpdateDTO
from tech.models import TechRoomAnswers, TechRooms, TechTasks


class RoomRepository:
    def __init__(self, session):
        self.session = session

    async def get(self, room_id: int) -> TechRooms | None:
        result = await self.session.execute(
            select(TechRooms)
            .options(selectinload(TechRooms.tasks), selectinload(TechRooms.answers))
            .where(TechRooms.id == room_id)
        )
        return result.scalar_one_or_none()

    async def list(self) -> list[TechRooms]:
        result = await self.session.execute(select(TechRooms).order_by(TechRooms.started_at.desc()))
        return list(result.scalars().all())

    async def create(self, data: RoomCreateDTO) -> TechRooms:
        result = await self.session.execute(select(TechTasks).where(TechTasks.id.in_(data.task_ids)))
        tasks = list(result.scalars().all())

        room = TechRooms(
            name=data.name,
            description=data.description,
            started_at=data.started_at,
            ended_at=data.ended_at,
            status=data.status,
            tasks=tasks,
        )
        self.session.add(room)
        await self.session.flush()

        answers = [
            TechRoomAnswers(room_id=room.id, task_id=task.id, order=index) for index, task in enumerate(tasks, start=1)
        ]
        self.session.add_all(answers)
        await self.session.commit()
        await self.session.refresh(room)
        return room

    async def update(self, room: TechRooms, data: RoomUpdateDTO) -> TechRooms:
        payload = data.model_dump(exclude_unset=True, exclude={'task_ids'})
        for field, value in payload.items():
            setattr(room, field, value)

        if data.task_ids is not None:
            result = await self.session.execute(select(TechTasks).where(TechTasks.id.in_(data.task_ids)))
            room.tasks = list(result.scalars().all())

        await self.session.commit()
        await self.session.refresh(room)
        return room
