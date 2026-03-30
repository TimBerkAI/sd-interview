import secrets
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from arch.enums import RoomStatusEnum
from settings.db import Base

if TYPE_CHECKING:
    from arch.models import ArchRoomAnswers, ArchTasks, Templates


class ArchRooms(Base):
    __tablename__ = 'rooms'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    task_id: Mapped[int] = mapped_column(ForeignKey('tasks.id', ondelete='RESTRICT'), nullable=False, index=True)
    template_id: Mapped[int] = mapped_column(
        ForeignKey('templates.id', ondelete='RESTRICT'), nullable=False, index=True
    )

    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ended_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Уникальные ссылки — токены
    candidate_token: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False,
        default=lambda: secrets.token_urlsafe(32),
    )
    reviewer_token: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False,
        default=lambda: secrets.token_urlsafe(32),
    )

    status: Mapped[RoomStatusEnum] = mapped_column(
        SAEnum(RoomStatusEnum, name='arch_room_status'),
        nullable=False,
        default=RoomStatusEnum.PENDING,
    )

    task = relationship('arch.models.tasks.ArchTasks', lazy='selectin')
    template = relationship('arch.models.templates.Templates', lazy='selectin')
    answers = relationship(
        'arch.models.room_answers.ArchRoomAnswers',
        back_populates='room',
        cascade='all, delete-orphan',
        order_by='arch.models.room_answers.ArchRoomAnswers.section_order',
        lazy='selectin',
    )

    def __repr__(self) -> str:
        return self.name
