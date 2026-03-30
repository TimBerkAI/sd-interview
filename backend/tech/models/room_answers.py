from sqlalchemy import ForeignKey, Integer, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Mapped, mapped_column, relationship


from settings.db import Base


class TechRoomAnswers(Base):
    __tablename__ = 'tech_room_answers'
    __table_args__ = (UniqueConstraint('room_id', 'task_id', 'order', name='uq_room_answers_room_task_order'),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    room_id: Mapped[int] = mapped_column(ForeignKey('tech_rooms.id', ondelete='CASCADE'), nullable=False, index=True)
    task_id: Mapped[int] = mapped_column(ForeignKey('tech_tasks.id', ondelete='RESTRICT'), nullable=False, index=True)
    order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    candidate_answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    reviewer_comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    score: Mapped[dict | None] = mapped_column(MutableDict.as_mutable(JSONB), nullable=True)

    room = relationship('tech.models.rooms.TechRooms', back_populates='answers')
    task = relationship('tech.models.tasks.TechTasks', lazy='joined')

    def __repr__(self) -> str:
        return f'{self.room_id}:{self.task_id}:{self.order}'
