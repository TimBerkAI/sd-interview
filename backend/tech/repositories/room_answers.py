from sqlalchemy import select
from sqlalchemy.orm import joinedload
from tech.dto.room_answers import RoomAnswerCreateDTO, RoomAnswerUpdateDTO
from tech.models import TechRoomAnswers


class RoomAnswerRepository:
    def __init__(self, session):
        self.session = session

    async def get(self, answer_id: int) -> TechRoomAnswers | None:
        result = await self.session.execute(
            select(TechRoomAnswers)
            .options(joinedload(TechRoomAnswers.room), joinedload(TechRoomAnswers.task))
            .where(TechRoomAnswers.id == answer_id)
        )
        return result.scalar_one_or_none()

    async def list_by_room(self, room_id: int) -> list[TechRoomAnswers]:
        result = await self.session.execute(
            select(TechRoomAnswers).where(TechRoomAnswers.room_id == room_id).order_by(TechRoomAnswers.order.asc())
        )
        return list(result.scalars().all())

    async def create(self, data: RoomAnswerCreateDTO) -> TechRoomAnswers:
        answer = TechRoomAnswers(**data.model_dump())
        self.session.add(answer)
        await self.session.commit()
        await self.session.refresh(answer)
        return answer

    async def update(self, answer: TechRoomAnswers, data: RoomAnswerUpdateDTO) -> TechRoomAnswers:
        payload = data.model_dump(exclude_unset=True)
        for field, value in payload.items():
            setattr(answer, field, value)
        await self.session.commit()
        await self.session.refresh(answer)
        return answer
