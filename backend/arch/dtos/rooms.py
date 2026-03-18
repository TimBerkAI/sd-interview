from datetime import datetime

from pydantic import model_validator

from arch.dtos.room_answers import RoomAnswerDTO
from arch.dtos.tasks import TaskDTO
from arch.dtos.templates import TemplateDTO
from arch.enums import RoomStatusEnum
from core.dtos import BaseDTO


class RoomCreateDTO(BaseDTO):
    name: str
    description: str | None = None
    task: int
    template: int
    started_at: datetime
    ended_at: datetime

    @model_validator(mode="after")
    def validate_dates(self) -> "RoomCreateDTO":
        if self.ended_at <= self.started_at:
            raise ValueError("ended_at must be after started_at")
        return self


class RoomWithAnswersDTO(BaseDTO):
    id: int
    name: str
    description: str | None = None
    status: RoomStatusEnum
    started_at: datetime
    ended_at: datetime
    task: TaskDTO
    template: TemplateDTO
    answers: list[RoomAnswerDTO]
