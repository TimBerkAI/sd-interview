from sqlalchemy import select, update
from sqlalchemy.orm import joinedload, selectinload

from arch.dtos.rooms import RoomCreateDTO, RoomWithAnswersDTO
from arch.enums import RoomStatusEnum
from arch.models import RoomAnswers, Rooms
from core.use_cases.async_base import RepositoryAsync


class RoomsRepository(RepositoryAsync):
    model = Rooms

    async def create(self, data: RoomCreateDTO) -> int:
        """Создание комнаты"""

        room = self.model(
            name=data.name,
            description=data.description,
            task_id=data.task,
            template_id=data.template,
            started_at=data.started_at,
            ended_at=data.ended_at,
        )
        self.session.add(room)
        await self.session.flush()
        return room.id

    async def find_room_with_answers_by_token(self, token: str, is_reviewer: bool) -> RoomWithAnswersDTO | None:
        """Комната со всеми ответами, секциями и связанными данными."""

        token_field = self.model.reviewer_token if is_reviewer else self.model.candidate_token

        result = await self.session.execute(
            select(self.model)
            .where(token_field == token)
            .options(
                joinedload(self.model.task),
                joinedload(self.model.template),
                selectinload(self.model.answers).joinedload(RoomAnswers.section),
            )
        )
        record = result.unique().scalar_one_or_none()
        if record:
            return RoomWithAnswersDTO.model_validate(record)
        return record

    async def update_status(
        self,
        room_id: int,
        status: RoomStatusEnum,
    ) -> bool:
        result = await self.session.execute(update(self.model).where(self.model.id == room_id).values(status=status))
        await self.session.commit()
        return int(result.rowcount) > 0
