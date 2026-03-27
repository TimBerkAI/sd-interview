from flow.enums import SectionDecisionEnum, SectionStatusEnum, SectionTypeEnum
from settings.db import Base
from sqlalchemy import Enum as SAEnum
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship


class CandidateWaySections(Base):
    __tablename__ = 'candidate_way_sections'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    way_id: Mapped[int] = mapped_column(ForeignKey('candidate_ways.id', ondelete='CASCADE'), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[SectionTypeEnum] = mapped_column(
        SAEnum(SectionTypeEnum, name='flow_way_section_type'),
        nullable=False,
        default=SectionTypeEnum.HR,
        server_default=SectionTypeEnum.HR,
    )
    status: Mapped[SectionStatusEnum] = mapped_column(
        SAEnum(SectionStatusEnum, name='flow_way_section_status'),
        nullable=False,
        default=SectionStatusEnum.NEW,
        server_default=SectionStatusEnum.NEW,
    )
    review: Mapped[str | None] = mapped_column(Text, nullable=True)
    decision: Mapped[SectionDecisionEnum] = mapped_column(
        SAEnum(SectionDecisionEnum, name='flow_way_section_decision'),
        nullable=False,
        default=SectionDecisionEnum.PENDING,
        server_default=SectionDecisionEnum.PENDING,
    )
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    skill_assessments: Mapped[list] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )

    way = relationship('CandidateWays', back_populates='sections')
