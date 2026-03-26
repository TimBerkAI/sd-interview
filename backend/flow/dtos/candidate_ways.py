from datetime import date, datetime

from core.dtos import BaseDTO
from core.enums import SpecialityEnum
from flow.enums import WayDecisionEnum, WayStatusEnum


class WayTagDTO(BaseDTO):
    id: int
    name: str
    color: str | None = None


class CandidateShortDTO(BaseDTO):
    id: int
    full_name: str
    specialty: SpecialityEnum


class CandidateWaySectionShortDTO(BaseDTO):
    id: int
    way_id: int
    name: str
    type: str
    status: str
    review: str | None = None
    decision: str
    sort_order: int
    skill_assessments: list = []


class CandidateWayDTO(BaseDTO):
    id: int
    candidate_id: int
    period_start: date | None = None
    period_end: date | None = None
    specialty: SpecialityEnum
    decision: WayDecisionEnum
    status: WayStatusEnum
    created_at: datetime | None = None
    tags: list[WayTagDTO] = []
    sections: list[CandidateWaySectionShortDTO] = []
    candidate: CandidateShortDTO | None = None
