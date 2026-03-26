from core.dtos import BaseDTO
from flow.enums import SectionDecisionEnum, SectionStatusEnum, SectionTypeEnum


class SectionSkill(BaseDTO):
    skill: str
    score: int | None
    review: str | None


class CandidateWaySectionDetailDTO(BaseDTO):
    id: int
    way_id: int
    name: str
    type: SectionTypeEnum
    status: SectionStatusEnum
    review: str | None
    decision: SectionDecisionEnum
    sort_order: int
    skill_assessments: list[SectionSkill]
