from sqlalchemy import update

from arch.dtos.sections import SectionListDTO
from arch.models import RoomAnswers
from core.use_cases.async_base import RepositoryAsync


class RoomAnswersRepository(RepositoryAsync):
    model = RoomAnswers

    async def add_for_room_sections(self, room_id: int, sections: list[SectionListDTO]) -> None:
        """Добавление ответов для секций комнаты"""

        for section in sections:
            self.session.add(self.model(room_id=room_id, section_id=section.id, section_order=section.order))

        await self.session.commit()

    async def update_candidate_answer(
        self,
        answer_id: int,
        candidate_answer: str,
    ) -> bool:
        result = await self.session.execute(
            update(self.model).where(self.model.id == answer_id).values(candidate_answer=candidate_answer)
        )
        await self.session.commit()
        return int(result.rowcount) > 0

    async def update_review(
        self,
        answer_id: int,
        reviewer_comment: str | None = None,
        mark: int | None = None,
    ) -> bool:
        values = {}
        if reviewer_comment is not None:
            values['reviewer_comment'] = reviewer_comment
        if mark is not None:
            values['mark'] = mark

        if not values:
            return False

        result = await self.session.execute(update(self.model).where(self.model.id == answer_id).values(**values))
        await self.session.commit()
        return int(result.rowcount) > 0
