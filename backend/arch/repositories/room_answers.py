from arch.dtos.sections import SectionListDTO
from arch.models import RoomAnswers
from core.use_cases.async_base import RepositoryAsync


class RoomAnswersRepository(RepositoryAsync):
    model = RoomAnswers

    async def add_for_room_sections(
        self, room_id: int, sections: list[SectionListDTO]
    ) -> None:
        """Добавление ответов для секций комнаты"""

        for section in sections:
            self.session.add(
                self.model(
                    room_id=room_id, section_id=section.id, section_order=section.order
                )
            )

        await self.session.commit()
