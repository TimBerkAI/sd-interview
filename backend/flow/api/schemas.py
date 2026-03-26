from typing import Any

from pydantic import BaseModel

from arch.enums import SectionStatusEnum as ArchSectionStatusEnum
from flow.enums import (
    SectionDecisionEnum,
    SectionTypeEnum,
    WayDecisionEnum,
    WayStatusEnum,
)


class SectionUpdateSchema(BaseModel):
    name: str | None = None
    type: SectionTypeEnum | None = None
    status: ArchSectionStatusEnum | None = None
    review: str | None = None
    decision: SectionDecisionEnum | None = None
    sort_order: int | None = None
    skill_assessments: list[Any] | None = None


class WayUpdateSchema(BaseModel):
    decision: WayDecisionEnum | None = None
    status: WayStatusEnum | None = None
    period_end: str | None = None
