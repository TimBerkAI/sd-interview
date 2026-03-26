from core.use_cases.async_base import AsyncUseCase
from flow.repositories import CandidatesRepository


class CandidateDetailAsyncUseCase(AsyncUseCase):
    def __init__(
        self,
        *args,
        record_id: int,
        candidate_repo: type[CandidatesRepository] = CandidatesRepository,
    ) -> None:
        super().__init__(*args)
        self.record_id = record_id
        self.candidate_repo = CandidatesRepository(self.session)

    async def execute(self):
        return await self.candidate_repo.get_by_id(self.record_id)
