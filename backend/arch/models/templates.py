from typing import TYPE_CHECKING

from sqlalchemy import Enum as SAEnum
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from arch.enums import TemplateStatusEnum
from core.enums import SpecialityEnum
from settings.db import Base

if TYPE_CHECKING:
    from arch.models import Sections


class Templates(Base):
    __tablename__ = 'templates'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    specialty: Mapped[SpecialityEnum] = mapped_column(SAEnum(SpecialityEnum, name='specialty'), nullable=False)
    status: Mapped[TemplateStatusEnum] = mapped_column(
        SAEnum(TemplateStatusEnum, name='template_status'),
        nullable=False,
        default=TemplateStatusEnum.DRAFT,
    )

    sections: Mapped[list['Sections']] = relationship(
        'Sections',
        back_populates='template',
        cascade='all, delete-orphan',
        order_by='Sections.order',
    )

    def __repr__(self) -> str:
        return self.name
