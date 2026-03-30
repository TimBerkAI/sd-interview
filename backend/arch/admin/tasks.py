from sqladmin import ModelView

from arch.enums import TaskStatusEnum
from arch.models import ArchTasks
from core.fields.ckeditor import CKEditorField


class ArchTaskAdmin(ModelView, model=ArchTasks):
    name = 'Задача'
    name_plural = 'Задачи'
    icon = 'fa-solid fa-list-check'

    column_list = [ArchTasks.id, ArchTasks.name, ArchTasks.slug, ArchTasks.status]
    column_searchable_list = [ArchTasks.name, ArchTasks.slug]
    column_sortable_list = [ArchTasks.id, ArchTasks.name, ArchTasks.status]

    form_columns = [ArchTasks.name, ArchTasks.slug, ArchTasks.description, ArchTasks.status]
    form_overrides = {
        'description': CKEditorField,
    }
    form_args = {
        'description': {
            'label': 'Description',
            'render_kw': {
                'rows': 12,
                'class': 'form-control',
                # CKEditor подключается через data-атрибут без сторонних зависимостей
                'data-editor': 'ckeditor',
            },
        },
        'status': {
            'label': 'Status',
            'choices': [(s.value, s.name) for s in TaskStatusEnum],
        },
    }

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    can_export = False
