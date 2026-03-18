from arch.dtos.rooms import RoomWithAnswersDTO
from arch.repositories.room_answers import RoomAnswersRepository
from arch.repositories.rooms import RoomsRepository
from core.exceptions import NotFoundRecord
from core.use_cases.async_base import AsyncUseCase


class RoomDetailAsyncUseCase(AsyncUseCase):
    def __init__(
        self,
        *args,
        token: str,
        room_repo: type[RoomsRepository] = RoomsRepository,
    ) -> None:
        super().__init__(*args)
        self.token = token
        self.room_repo = room_repo(self.session)
        self.room_ans_repo = RoomAnswersRepository(self.session)

    async def execute(self, is_reviewer: bool) -> RoomWithAnswersDTO:
        room = await self.room_repo.find_room_with_answers_by_token(
            self.token, is_reviewer
        )
        if not room:
            raise NotFoundRecord("Room not found")
        return room
