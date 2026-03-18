from core.dtos import BaseDTO


class TaskDTO(BaseDTO):
    id: int
    name: str
    slug: str
