from core.dtos import BaseDTO
from core.enums import SpecialityEnum


class TemplateDTO(BaseDTO):
    id: int
    name: str
    specialty: SpecialityEnum
