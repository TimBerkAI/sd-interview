from tech.dto.room_answers import RoomAnswerUpdateDTO
from tech.models import TechRoomAnswers
from sqlalchemy import select


class TechAnswerUpdaterUseCase:
    def __init__(self, session):
        self.session = session

    async def execute(self, answer_id: int, data: RoomAnswerUpdateDTO) -> TechRoomAnswers | None:
        result = await self.session.execute(
            select(TechRoomAnswers).where(TechRoomAnswers.id == answer_id)
        )
        answer = result.scalar_one_or_none()
        if not answer:
            return None

        payload = data.model_dump(exclude_unset=True)
        for field, value in payload.items():
            setattr(answer, field, value)

        await self.session.commit()
        await self.session.refresh(answer)
        return answer
