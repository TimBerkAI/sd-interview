from sqlalchemy import select

from core.use_cases.async_base import RepositoryAsync
from flow.api.schemas import SectionUpdateSchema
from flow.dtos import CandidateWaySectionDetailDTO
from flow.models import CandidateWaySections


class CandidateWaySectionsRepository(RepositoryAsync):
    model = CandidateWaySections

    async def get_by_id(self, record_id: int) -> CandidateWaySectionDetailDTO | None:
        stmt = select(self.model).where(self.model.id == record_id)
        result = await self.session.execute(stmt)
        record = result.scalar_one_or_none()
        if record:
            return CandidateWaySectionDetailDTO.model_validate(record)
        return None

    async def get_orm_by_id(self, record_id: int):
        stmt = select(self.model).where(self.model.id == record_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def update(self, record_id: int, data: SectionUpdateSchema) -> bool:
        record = await self.get_orm_by_id(record_id)
        if not record:
            return False

        if data.name is not None:
            record.name = data.name
        if data.type is not None:
            record.type = data.type
        if data.status is not None:
            record.status = data.status
        if data.review is not None:
            record.review = data.review
        if data.decision is not None:
            record.decision = data.decision
        if data.sort_order is not None:
            record.sort_order = data.sort_order
        if data.skill_assessments is not None:
            record.skill_assessments = data.skill_assessments

        await self.session.commit()

        return True
