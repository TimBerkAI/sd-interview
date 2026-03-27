from datetime import date, datetime

from core.enums import SpecialityEnum
from flow.enums import WayDecisionEnum, WayStatusEnum
from settings.db import Base
from sqlalchemy import Date, DateTime, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship


class CandidateWays(Base):
    __tablename__ = 'candidate_ways'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    candidate_id: Mapped[int] = mapped_column(ForeignKey('candidates.id', ondelete='CASCADE'), nullable=False)
    period_start: Mapped[date] = mapped_column(Date, server_default=func.current_date())
    period_end: Mapped[date | None] = mapped_column(Date)
    specialty: Mapped[SpecialityEnum] = mapped_column(SAEnum(SpecialityEnum, name='flow_way_specialty'), nullable=False)
    decision: Mapped[WayDecisionEnum] = mapped_column(
        SAEnum(WayDecisionEnum, name='flow_way_decision'),
        nullable=False,
        default=WayDecisionEnum.IN_PROGRESS,
        server_default=WayDecisionEnum.IN_PROGRESS,
    )
    status: Mapped[WayStatusEnum] = mapped_column(
        SAEnum(WayStatusEnum, name='flow_way_status'),
        nullable=False,
        default=WayStatusEnum.ACTIVE,
        server_default=WayStatusEnum.ACTIVE,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    candidate = relationship('Candidates', back_populates='ways')
    sections = relationship('CandidateWaySections', back_populates='way', cascade='all, delete-orphan')
    tags = relationship('Tags', secondary='candidate_way_tags', back_populates='ways')


class CandidateWayTags(Base):
    __tablename__ = 'candidate_way_tags'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    way_id: Mapped[int] = mapped_column(ForeignKey('candidate_ways.id', ondelete='CASCADE'), nullable=False)
    tag_id: Mapped[int] = mapped_column(ForeignKey('tags.id', ondelete='CASCADE'), nullable=False)

    __table_args__ = (UniqueConstraint('way_id', 'tag_id', name='uq_candidate_way_tag'),)
