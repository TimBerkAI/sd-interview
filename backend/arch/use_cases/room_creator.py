from arch.dtos.rooms import RoomCreateDTO
from arch.repositories.room_answers import RoomAnswersRepository
from arch.repositories.rooms import RoomsRepository
from arch.repositories.sections import SectionsRepository
from core.use_cases.async_base import AsyncUseCase


class RoomCreatorAsyncUseCase(AsyncUseCase):
    def __init__(
        self,
        *args,
        room_data: RoomCreateDTO,
        room_repo: type[RoomsRepository] = RoomsRepository,
        section_repo: type[SectionsRepository] = SectionsRepository,
        room_ans_repo: type[RoomAnswersRepository] = RoomAnswersRepository,
    ) -> None:
        super().__init__(*args)
        self.room_data = room_data
        self.room_repo = RoomsRepository(self.session)
        self.section_repo = SectionsRepository(self.session)
        self.room_ans_repo = RoomAnswersRepository(self.session)

    async def execute(self):
        room_id = await self.room_repo.create(self.room_data)
        sections = await self.section_repo.get_by_template_id(self.room_data.template)
        await self.room_ans_repo.add_for_room_sections(room_id, sections)
