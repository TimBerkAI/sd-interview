from sqlalchemy import select
from sqlalchemy.orm import selectinload

from core.use_cases.async_base import RepositoryAsync
from flow.dtos import CandidateDetailDTO, CandidateListDTO
from flow.models import Candidates, CandidateWays


class CandidatesRepository(RepositoryAsync):
    model = Candidates
    model_way = CandidateWays

    async def get_list(self) -> list[CandidateListDTO]:
        stmt = select(self.model).order_by(self.model.created_at.desc())
        result = await self.session.execute(stmt)
        candidates = result.scalars().all()
        return [CandidateListDTO.model_validate(c) for c in candidates]

    async def get_by_id(self, record_id: int) -> CandidateDetailDTO | None:
        stmt = (
            select(self.model)
            .options(
                selectinload(self.model.ways).selectinload(self.model_way.sections),
                selectinload(self.model.ways).selectinload(self.model_way.tags),
            )
            .where(self.model.id == record_id)
        )
        result = await self.session.execute(stmt)
        record = result.scalar_one_or_none()
        if not record:
            return CandidateDetailDTO.model_validate(record)
        return None
