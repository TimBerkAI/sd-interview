from sqladmin import ModelView
from starlette.requests import Request

from arch.dtos.rooms import RoomCreateDTO
from arch.models import Rooms
from arch.use_cases.room_creator import RoomCreatorAsyncUseCase
from core.fields.ckeditor import CKEditorField
from settings.db import AsyncSessionLocal


class RoomAdmin(ModelView, model=Rooms):
    name = 'Комната'
    name_plural = 'Комнаты'
    icon = 'fa-solid fa-door-open'
    details_template = 'arch/rooms/detail.html'

    column_list = [
        Rooms.id,
        Rooms.name,
        Rooms.status,
        Rooms.started_at,
        Rooms.ended_at,
        Rooms.candidate_token,
        Rooms.reviewer_token,
    ]
    column_searchable_list = [Rooms.name]
    column_sortable_list = [Rooms.id, Rooms.name, Rooms.status, Rooms.started_at]
    form_overrides = {
        'description': CKEditorField,
    }
    form_columns = [
        Rooms.name,
        Rooms.description,
        Rooms.task,
        Rooms.template,
        Rooms.started_at,
        Rooms.ended_at,
        Rooms.status,
    ]

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    can_export = False

    async def after_model_change(self, data: dict, model: Rooms, is_created: bool, request: Request) -> None:
        """Создаём ответы для каждой секции шаблона после создания комнаты."""
        if not is_created:
            return

        print(data)
        async with AsyncSessionLocal() as session:
            room_data = RoomCreateDTO.model_validate(data)
            use_case = RoomCreatorAsyncUseCase(session, room_data=room_data)

            await use_case.execute()
            await session.commit()
