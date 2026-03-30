from datetime import datetime

from pydantic import BaseModel, ConfigDict
from tech.enums import RoomStatusEnum


class RoomCreateDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    description: str | None = None
    started_at: datetime
    ended_at: datetime
    task_ids: list[int]
    status: RoomStatusEnum = RoomStatusEnum.PENDING


class RoomUpdateDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str | None = None
    description: str | None = None
    started_at: datetime | None = None
    ended_at: datetime | None = None
    task_ids: list[int] | None = None
    status: RoomStatusEnum | None = None


class RoomDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None = None
    started_at: datetime
    ended_at: datetime
    candidate_token: str
    reviewer_token: str
    status: RoomStatusEnum
