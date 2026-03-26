from sqladmin import ModelView
from wtforms import ColorField

from core.models import Tags


class TagsAdmin(ModelView, model=Tags):
    name = 'Тэг'
    name_plural = 'Тэги'
    icon = 'fa-solid fa-tag'

    form_overrides = {
        'color': ColorField,
    }

    column_list = [Tags.id, Tags.name, Tags.color]
    column_searchable_list = [Tags.name]
    column_sortable_list = [Tags.id, Tags.name]
    form_columns = [Tags.name, Tags.color]
    column_details_list = [Tags.id, Tags.name, Tags.color]
