from core.use_cases.async_base import AsyncUseCase
from flow.repositories import CandidateWaysRepository


class CandidateWayDetailAsyncUseCase(AsyncUseCase):
    def __init__(
        self,
        *args,
        record_id: int,
        way_repo: type[CandidateWaysRepository] = CandidateWaysRepository,
    ) -> None:
        super().__init__(*args)
        self.record_id = record_id
        self.way_repo = CandidateWaysRepository(self.session)

    async def execute(self):
        await self.way_repo.get_by_id(self.record_id)
