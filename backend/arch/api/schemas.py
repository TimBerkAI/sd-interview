from pydantic import BaseModel

from arch.enums import RoomStatusEnum


class TokenRequest(BaseModel):
    token: str


class AnswerUpdate(BaseModel):
    candidate_answer: str


class FeedbackUpdate(BaseModel):
    reviewer_comment: str
    mark: int | None = None


class StatusUpdate(BaseModel):
    status: RoomStatusEnum
