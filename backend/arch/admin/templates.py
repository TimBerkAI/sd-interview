from sqladmin import ModelView

from arch.enums import TemplateStatusEnum
from arch.models import Templates
from core.enums import SpecialityEnum


class ArchTemplateAdmin(ModelView, model=Templates):
    name = 'Шаблон'
    name_plural = 'Шаблоны'
    icon = 'fa-solid fa-file-lines'

    column_list = [Templates.id, Templates.name, Templates.specialty, Templates.status]
    column_searchable_list = [Templates.name]
    column_sortable_list = [
        Templates.id,
        Templates.name,
        Templates.specialty,
        Templates.status,
    ]

    form_columns = [
        Templates.name,
        Templates.specialty,
        Templates.status,
        Templates.sections,
    ]
    form_args = {
        'specialty': {
            'label': 'Specialty',
            'choices': [(s.value, s.name) for s in SpecialityEnum],
        },
        'status': {
            'label': 'Status',
            'choices': [(s.value, s.name) for s in TemplateStatusEnum],
        },
    }
    # Async select для связи sections
    form_ajax_refs = {
        'sections': {
            'fields': ('name',),
            'order_by': 'name',
        }
    }

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    can_export = False
