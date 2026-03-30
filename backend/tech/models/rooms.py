import secrets
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, Table, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from settings.db import Base
from tech.enums import RoomStatusEnum


class TechRooms(Base):
    __tablename__ = 'tech_rooms'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    ended_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)

    candidate_token: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False,
        index=True,
        default=lambda: secrets.token_urlsafe(32),
    )
    reviewer_token: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False,
        index=True,
        default=lambda: secrets.token_urlsafe(32),
    )

    status: Mapped[RoomStatusEnum] = mapped_column(
        SAEnum(RoomStatusEnum, name='tech_room_status'),
        nullable=False,
        default=RoomStatusEnum.PENDING,
        index=True,
    )

    tasks = relationship(
        'tech.models.tasks.TechTasks',
        secondary='tech_room_tasks',
        back_populates='rooms',
        lazy='selectin',
    )
    answers = relationship(
        'tech.models.room_answers.TechRoomAnswers',
        back_populates='room',
        cascade='all, delete-orphan',
        order_by='tech.models.room_answers.TechRoomAnswers.order',
        lazy='selectin',
    )

    def __repr__(self) -> str:
        return self.name


room_tasks = Table(
    'tech_room_tasks',
    Base.metadata,
    Column('room_id', ForeignKey('tech_rooms.id', ondelete='CASCADE'), primary_key=True),
    Column('task_id', ForeignKey('tech_tasks.id', ondelete='CASCADE'), primary_key=True),
)
