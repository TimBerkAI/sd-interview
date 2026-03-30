import typing as t

from pydantic import BaseModel, ConfigDict


class RoomAnswerCreateDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    room_id: int
    task_id: int
    order: int
    candidate_answer: str | None = None
    reviewer_comment: str | None = None
    score: dict | None = None


class RoomAnswerUpdateDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    candidate_answer: str | None = None
    reviewer_comment: str | None = None
    score: dict | None = None


class TaskInAnswerDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    type: str
    description: str | None = None
    score_scale: list[dict[str, t.Any]]


class RoomAnswerDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    room_id: int
    task_id: int
    order: int
    candidate_answer: str | None = None
    reviewer_comment: str | None = None
    score: dict | None = None
    task: TaskInAnswerDTO
