from arch.enums import SectionTypeEnum
from core.dtos import BaseDTO


class ScoreScaleDTO(BaseDTO):
    score: int
    comment: str | None


class SectionListDTO(BaseDTO):
    id: int
    template_id: int
    name: str
    description: str | None
    order: int
    type: SectionTypeEnum
    score_scale: list[ScoreScaleDTO]
