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

    order: int | None = None
    candidate_answer: str | None = None
    reviewer_comment: str | None = None
    score: dict | None = None


class RoomAnswerDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    room_id: int
    task_id: int
    order: int
    candidate_answer: str | None = None
    reviewer_comment: str | None = None
    score: dict | None = None
