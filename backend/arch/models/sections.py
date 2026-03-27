from typing import TYPE_CHECKING, Any

from settings.db import Base
from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from arch.enums import SectionTypeEnum

if TYPE_CHECKING:
    from arch.models import Templates


class Sections(Base):
    __tablename__ = 'sections'
    __table_args__ = (
        CheckConstraint(
            'jsonb_array_length(score_scale) BETWEEN 1 AND 5',
            name='ck_sections_score_scale_length',
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    template_id: Mapped[int] = mapped_column(
        ForeignKey('templates.id', ondelete='CASCADE'),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    type: Mapped[SectionTypeEnum] = mapped_column(
        SAEnum(SectionTypeEnum, name='arch_section_type'),
        nullable=False,
    )
    # [{"score": 1, "comment": "..."}, ..., {"score": 5, "comment": "..."}]
    score_scale: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
    )

    template: Mapped['Templates'] = relationship('Templates', back_populates='sections')

    def __repr__(self) -> str:
        return self.name
