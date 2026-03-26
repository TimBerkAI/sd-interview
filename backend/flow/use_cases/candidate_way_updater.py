from core.use_cases.async_base import AsyncUseCase
from flow.api.schemas import WayUpdateSchema
from flow.repositories import CandidateWaysRepository


class CandidateWayUpdaterAsyncUseCase(AsyncUseCase):
    def __init__(
        self,
        *args,
        record_id: int,
        data: WayUpdateSchema,
        way_repo: type[CandidateWaysRepository] = CandidateWaysRepository,
    ) -> None:
        super().__init__(*args)
        self.record_id = record_id
        self.data = data
        self.way_repo = CandidateWaysRepository(self.session)

    async def execute(self):
        return await self.way_repo.update(self.record_id, self.data)
