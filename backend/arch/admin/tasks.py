from sqladmin import ModelView
from wtforms import TextAreaField

from arch.enums import TaskStatusEnum
from arch.models import Tasks


class TaskAdmin(ModelView, model=Tasks):
    name = "Задача"
    name_plural = "Задачи"
    icon = "fa-solid fa-list-check"

    column_list = [Tasks.id, Tasks.name, Tasks.slug, Tasks.status]
    column_searchable_list = [Tasks.name, Tasks.slug]
    column_sortable_list = [Tasks.id, Tasks.name, Tasks.status]

    form_columns = [Tasks.name, Tasks.slug, Tasks.description, Tasks.status]
    form_overrides = {
        "description": TextAreaField,
    }
    form_args = {
        "description": {
            "label": "Description",
            "render_kw": {
                "rows": 12,
                "class": "form-control",
                # CKEditor подключается через data-атрибут без сторонних зависимостей
                "data-editor": "ckeditor",
            },
        },
        "status": {
            "label": "Status",
            "choices": [(s.value, s.name) for s in TaskStatusEnum],
        },
    }

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    can_export = False
