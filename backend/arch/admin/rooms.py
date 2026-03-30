from sqladmin import ModelView
from starlette.requests import Request

from arch.dtos.rooms import RoomCreateDTO
from arch.models import ArchRooms
from arch.use_cases.room_creator import RoomCreatorAsyncUseCase
from core.fields.ckeditor import CKEditorField
from settings.db import AsyncSessionLocal


class ArchRoomAdmin(ModelView, model=ArchRooms):
    name = 'Комната'
    name_plural = 'Комнаты'
    icon = 'fa-solid fa-door-open'
    details_template = 'arch/rooms/detail.html'

    column_list = [
        ArchRooms.id,
        ArchRooms.name,
        ArchRooms.status,
        ArchRooms.started_at,
        ArchRooms.ended_at,
        ArchRooms.candidate_token,
        ArchRooms.reviewer_token,
    ]
    column_searchable_list = [ArchRooms.name]
    column_sortable_list = [ArchRooms.id, ArchRooms.name, ArchRooms.status, ArchRooms.started_at]
    form_overrides = {
        'description': CKEditorField,
    }
    form_columns = [
        ArchRooms.name,
        ArchRooms.description,
        ArchRooms.task,
        ArchRooms.template,
        ArchRooms.started_at,
        ArchRooms.ended_at,
        ArchRooms.status,
    ]

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    can_export = False

    async def after_model_change(self, data: dict, model: ArchRooms, is_created: bool, request: Request) -> None:
        """Создаём ответы для каждой секции шаблона после создания комнаты."""
        if not is_created:
            return

        async with AsyncSessionLocal() as session:
            room_data = RoomCreateDTO.model_validate(data)
            use_case = RoomCreatorAsyncUseCase(session, room_data=room_data)

            await use_case.execute()
            await session.commit()
