from datetime import datetime

from core.dtos import BaseDTO
from core.enums import SpecialityEnum
from flow.dtos.candidate_ways import CandidateWayDTO


class CandidateLink(BaseDTO):
    label: str
    url: str


class CandidateListDTO(BaseDTO):
    id: int
    full_name: str
    description: str | None = None
    specialty: SpecialityEnum
    links: list[CandidateLink] = []
    created_at: datetime


class CandidateDetailDTO(CandidateListDTO):
    ways: list[CandidateWayDTO]
