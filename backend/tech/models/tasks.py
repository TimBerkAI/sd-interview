import typing as t

from sqlalchemy import Column, ForeignKey, String, Table, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.enums import SpecialityEnum
from settings.db import Base
from tech.enums import TaskStatusEnum, TaskTypeEnum


class TechTasks(Base):
    __tablename__ = 'tech_tasks'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    specialty: Mapped[SpecialityEnum] = mapped_column(
        SAEnum(SpecialityEnum, name='tech_task_specialty'), nullable=False
    )
    type: Mapped[TaskTypeEnum] = mapped_column(
        SAEnum(TaskTypeEnum, name='tech_task_type'),
        nullable=False,
        index=True,
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    score_scale: Mapped[list[dict[str, t.Any]]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )
    status: Mapped[TaskStatusEnum] = mapped_column(
        SAEnum(TaskStatusEnum, name='tech_task_status'),
        nullable=False,
        default=TaskStatusEnum.DRAFT,
        index=True,
    )
    tags = relationship(
        'Tags',
        secondary='tech_task_tags',
        back_populates='tech_tasks',
        lazy='selectin',
    )
    rooms = relationship(
        'tech.models.rooms.TechRooms',
        secondary='tech_room_tasks',
        back_populates='tasks',
        lazy='selectin',
    )

    def __repr__(self) -> str:
        return self.name


task_tags = Table(
    'tech_task_tags',
    Base.metadata,
    Column('task_id', ForeignKey('tech_tasks.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
)
