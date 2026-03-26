from datetime import datetime

from core.dtos import BaseDTO
from core.enums import SpecialityEnum
from flow.enums import WayDecisionEnum, WayStatusEnum


class WayTagDTO(BaseDTO):
    id: int
    name: str
    color: str


class CandidateWayDTO(BaseDTO):
    id: int
    candidate_id: int
    period_start: datetime | None
    period_end: datetime | None
    specialty: SpecialityEnum
    decision: WayDecisionEnum
    status: WayStatusEnum
    created_at: datetime | None
    tags: list[WayTagDTO]
    sections: datetime | None
