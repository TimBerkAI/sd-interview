from core.use_cases.async_base import AsyncUseCase
from flow.repositories import CandidateWaysRepository


class CandidateWayListAsyncUseCase(AsyncUseCase):
    def __init__(
        self,
        *args,
        way_repo: type[CandidateWaysRepository] = CandidateWaysRepository,
    ) -> None:
        super().__init__(*args)
        self.way_repo = CandidateWaysRepository(self.session)

    async def execute(self):
        return await self.way_repo.get_list()
