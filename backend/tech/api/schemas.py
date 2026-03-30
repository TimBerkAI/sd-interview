from pydantic import BaseModel

from tech.enums import RoomStatusEnum


class TechTokenRequest(BaseModel):
    token: str


class TechAnswerUpdate(BaseModel):
    candidate_answer: str


class TechFeedbackUpdate(BaseModel):
    reviewer_comment: str
    score: dict | None = None


class TechStatusUpdate(BaseModel):
    status: RoomStatusEnum
