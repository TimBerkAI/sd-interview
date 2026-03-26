from core.use_cases.async_base import AsyncUseCase
from flow.repositories import CandidatesRepository


class CandidateListAsyncUseCase(AsyncUseCase):
    def __init__(
        self,
        *args,
        candidate_repo: type[CandidatesRepository] = CandidatesRepository,
    ) -> None:
        super().__init__(*args)
        self.candidate_repo = CandidatesRepository(self.session)

    async def execute(self):
        return await self.candidate_repo.get_list()
