from arch.enums import RoomStatusEnum
from arch.repositories.rooms import RoomsRepository
from core.use_cases.async_base import AsyncUseCase


class RoomStatusUpdaterAsyncUseCase(AsyncUseCase):
    def __init__(
        self,
        *args,
        room_id: int,
        status: RoomStatusEnum,
        room_ans_repo: type[RoomsRepository] = RoomsRepository,
    ) -> None:
        super().__init__(*args)
        self.room_id = room_id
        self.status = status
        self.room_repo = RoomsRepository(self.session)

    async def execute(self):
        await self.room_repo.update_status(self.room_id, self.status)
