from arch.dtos.sections import SectionDetailDTO
from core.dtos import BaseDTO


class RoomAnswerDTO(BaseDTO):
    id: int
    section_id: int
    section_order: int
    candidate_answer: str | None = None
    reviewer_comment: str | None = None
    mark: int | None = None
    section: SectionDetailDTO
