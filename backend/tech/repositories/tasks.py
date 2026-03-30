from core.models import Tags
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from tech.dto import TaskCreateDTO, TaskUpdateDTO
from tech.models import TechTasks


class TaskRepository:
    def __init__(self, session):
        self.session = session

    async def get(self, task_id: int) -> TechTasks | None:
        result = await self.session.execute(
            select(TechTasks).options(selectinload(TechTasks.tags)).where(TechTasks.id == task_id)
        )
        return result.scalar_one_or_none()

    async def list(self) -> list[TechTasks]:
        result = await self.session.execute(select(TechTasks).order_by(TechTasks.id.desc()))
        return list(result.scalars().all())

    async def create(self, data: TaskCreateDTO) -> TechTasks:
        tags = []
        if data.tag_ids:
            result = await self.session.execute(select(Tags).where(Tags.id.in_(data.tag_ids)))
            tags = list(result.scalars().all())

        task = TechTasks(
            name=data.name,
            specialty=data.specialty,
            tags=tags,
            type=data.type,
            description=data.description,
            score_scale=data.score_scale,
            status=data.status,
        )
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def update(self, task: TechTasks, data: TaskUpdateDTO) -> TechTasks:
        payload = data.model_dump(exclude_unset=True, exclude={'tag_ids'})
        for field, value in payload.items():
            setattr(task, field, value)

        if data.tag_ids is not None:
            if data.tag_ids:
                result = await self.session.execute(select(Tags).where(Tags.id.in_(data.tag_ids)))
                task.tags = list(result.scalars().all())
            else:
                task.tags = []

        await self.session.commit()
        await self.session.refresh(task)
        return task
