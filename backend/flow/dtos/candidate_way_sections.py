from arch.enums import SectionStatusEnum as ArchSectionStatusEnum
from core.dtos import BaseDTO
from flow.enums import SectionDecisionEnum, SectionTypeEnum


class SectionSkill(BaseDTO):
    skill: str
    score: int | None = None
    review: str | None = None


class CandidateWaySectionDetailDTO(BaseDTO):
    id: int
    way_id: int
    name: str
    type: SectionTypeEnum
    status: ArchSectionStatusEnum
    review: str | None = None
    decision: SectionDecisionEnum
    sort_order: int
    skill_assessments: list[SectionSkill] = []
