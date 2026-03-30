from sqlalchemy import select
from sqlalchemy.orm import selectinload

from tech.dto.rooms import RoomWithAnswersDTO
from tech.models import TechRoomAnswers, TechRooms


class TechRoomDetailUseCase:
    def __init__(self, session):
        self.session = session

    async def execute(self, token: str, is_reviewer: bool) -> RoomWithAnswersDTO | None:
        token_field = TechRooms.reviewer_token if is_reviewer else TechRooms.candidate_token
        result = await self.session.execute(
            select(TechRooms)
            .options(
                selectinload(TechRooms.answers).selectinload(TechRoomAnswers.task),
            )
            .where(token_field == token)
        )
        room = result.scalar_one_or_none()
        if not room:
            return None
        return RoomWithAnswersDTO.model_validate(room)
