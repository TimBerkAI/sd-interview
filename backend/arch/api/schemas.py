from datetime import datetime
from typing import Any

from pydantic import BaseModel

from arch.enums import RoomStatusEnum, SectionTypeEnum, TaskStatusEnum, TemplateStatusEnum
from core.enums import SpecialityEnum


class TokenRequest(BaseModel):
    token: str


class AnswerUpdate(BaseModel):
    candidate_answer: str


class FeedbackUpdate(BaseModel):
    reviewer_comment: str
    mark: int | None = None


class StatusUpdate(BaseModel):
    status: RoomStatusEnum


class TaskCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None
    status: TaskStatusEnum = TaskStatusEnum.DRAFT


class TaskUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    status: TaskStatusEnum | None = None


class SectionCreate(BaseModel):
    name: str
    description: str | None = None
    order: int = 0
    type: SectionTypeEnum
    score_scale: list[dict[str, Any]] = []


class SectionUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    order: int | None = None
    type: SectionTypeEnum | None = None
    score_scale: list[dict[str, Any]] | None = None


class TemplateCreate(BaseModel):
    name: str
    specialty: SpecialityEnum
    status: TemplateStatusEnum = TemplateStatusEnum.DRAFT


class TemplateUpdate(BaseModel):
    name: str | None = None
    specialty: SpecialityEnum | None = None
    status: TemplateStatusEnum | None = None


class RoomCreate(BaseModel):
    name: str
    description: str | None = None
    task_id: int
    template_id: int
    started_at: datetime
    ended_at: datetime


class RoomUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    task_id: int | None = None
    template_id: int | None = None
    started_at: datetime | None = None
    ended_at: datetime | None = None
    status: RoomStatusEnum | None = None
