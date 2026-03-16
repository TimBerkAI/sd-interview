from arch.dtos.rooms import RoomCreateDTO
from arch.models import Rooms
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
