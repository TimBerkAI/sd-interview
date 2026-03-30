from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from settings.db import Base

if TYPE_CHECKING:
    from arch.models import ArchRooms, Sections


class ArchRoomAnswers(Base):
    __tablename__ = 'room_answers'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    room_id: Mapped[int] = mapped_column(ForeignKey('rooms.id', ondelete='CASCADE'), nullable=False, index=True)
    section_id: Mapped[int] = mapped_column(ForeignKey('sections.id', ondelete='RESTRICT'), nullable=False, index=True)
    # Копируем order из секции для стабильной сортировки
    section_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    candidate_answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    reviewer_comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    mark: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 1–5

    room = relationship('arch.models.rooms.ArchRooms', back_populates='answers')
    section = relationship('arch.models.sections.Sections', lazy='joined')
