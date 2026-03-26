from sqlalchemy import select
from sqlalchemy.orm import selectinload

from core.use_cases.async_base import RepositoryAsync
from flow.api.schemas import WayUpdateSchema
from flow.dtos import CandidateWayDTO
from flow.models import CandidateWays


class CandidateWaysRepository(RepositoryAsync):
    model = CandidateWays

    async def get_list(self) -> list[CandidateWayDTO]:
        stmt = (
            select(self.model)
            .options(
                selectinload(self.model.candidate),
                selectinload(self.model.sections),
                selectinload(self.model.tags),
            )
            .order_by(self.model.created_at.desc())
        )
        result = await self.session.execute(stmt)
        ways = result.scalars().all()
        return [CandidateWayDTO.model_validate(w) for w in ways]

    async def get_by_id(self, record_id: int) -> CandidateWayDTO | None:
        stmt = (
            select(self.model)
            .options(
                selectinload(self.model.candidate),
                selectinload(self.model.sections),
                selectinload(self.model.tags),
            )
            .where(self.model.id == record_id)
        )
        result = await self.session.execute(stmt)
        record = result.scalar_one_or_none()
        if record:
            return CandidateWayDTO.model_validate(record)
        return None

    async def get_orm_by_id(self, record_id: int):
        stmt = select(self.model).where(self.model.id == record_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def update(self, record_id: int, data: WayUpdateSchema) -> bool:
        record = await self.get_orm_by_id(record_id)
        if not record:
            return False

        if data.decision is not None:
            record.decision = data.decision
        if data.status is not None:
            record.status = data.status

        await self.session.commit()

        return True
