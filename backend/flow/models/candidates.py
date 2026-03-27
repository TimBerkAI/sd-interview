import typing as t
from datetime import datetime

from core.enums import SpecialityEnum
from settings.db import Base
from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Candidates(Base):
    __tablename__ = 'candidates'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    specialty: Mapped[SpecialityEnum] = mapped_column(
        SAEnum(SpecialityEnum, name='flow_candidate_specialty'), nullable=False
    )
    links: Mapped[list[dict[str, t.Any]]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    ways = relationship('CandidateWays', back_populates='candidate', cascade='all, delete-orphan')

    def __repr__(self) -> str:
        return self.full_name
