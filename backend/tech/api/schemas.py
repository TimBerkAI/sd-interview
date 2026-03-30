from datetime import datetime
from typing import Any

from pydantic import BaseModel

from core.enums import SpecialityEnum
from tech.enums import RoomStatusEnum, TaskStatusEnum, TaskTypeEnum


class TechTokenRequest(BaseModel):
    token: str


class TechAnswerUpdate(BaseModel):
    candidate_answer: str


class TechFeedbackUpdate(BaseModel):
    reviewer_comment: str
    score: dict | None = None


class TechStatusUpdate(BaseModel):
    status: RoomStatusEnum


class TechTaskCreate(BaseModel):
    name: str
    specialty: SpecialityEnum
    type: TaskTypeEnum
    description: str | None = None
    score_scale: list[dict[str, Any]] = []
    status: TaskStatusEnum = TaskStatusEnum.DRAFT


class TechTaskUpdate(BaseModel):
    name: str | None = None
    specialty: SpecialityEnum | None = None
    type: TaskTypeEnum | None = None
    description: str | None = None
    score_scale: list[dict[str, Any]] | None = None
    status: TaskStatusEnum | None = None


class TechRoomCreate(BaseModel):
    name: str
    description: str | None = None
    started_at: datetime
    ended_at: datetime
    task_ids: list[int] = []


class TechRoomUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    started_at: datetime | None = None
    ended_at: datetime | None = None
    status: RoomStatusEnum | None = None
    task_ids: list[int] | None = None
