from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from settings.db import Base


class Tags(Base):
    __tablename__ = 'tags'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(256), nullable=False, unique=True)
    color: Mapped[str] = mapped_column(String(7), nullable=False, default='#000000')

    ways = relationship('CandidateWays', secondary='candidate_way_tags', back_populates='tags')
    tech_tasks = relationship('tech.models.tasks.TechTasks', secondary='tech_task_tags', back_populates='tags')

    def __repr__(self) -> str:
        return self.name
