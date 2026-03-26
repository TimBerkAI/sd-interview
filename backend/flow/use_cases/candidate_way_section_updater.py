from core.use_cases.async_base import AsyncUseCase
from flow.api.schemas import SectionUpdateSchema
from flow.repositories import CandidateWaySectionsRepository


class CandidateWaySectionUpdaterAsyncUseCase(AsyncUseCase):
    def __init__(
        self,
        *args,
        record_id: int,
        data: SectionUpdateSchema,
        section_repo: type[CandidateWaySectionsRepository] = CandidateWaySectionsRepository,
    ) -> None:
        super().__init__(*args)
        self.record_id = record_id
        self.data = data
        self.section_repo = CandidateWaySectionsRepository(self.session)

    async def execute(self):
        return await self.section_repo.update(self.record_id, self.data)
