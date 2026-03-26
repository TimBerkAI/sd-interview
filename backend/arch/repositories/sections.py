from sqlalchemy import select

from arch.dtos.sections import SectionListDTO
from arch.models import Sections
from core.use_cases.async_base import RepositoryAsync


class SectionsRepository(RepositoryAsync):
    model = Sections

    async def get_by_template_id(self, template_id: int) -> list[SectionListDTO]:
        """Получение секций по ID шаблона"""

        stmt = await self.session.execute(
            select(self.model).where(self.model.template_id == template_id).order_by(self.model.order)
        )
        return [SectionListDTO.model_validate(item) for item in stmt.scalars().all()]
