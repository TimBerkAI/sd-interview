from sqladmin import ModelView
from starlette.requests import Request
from wtforms import validators

from arch.enums import SectionTypeEnum
from arch.models import Sections
from core.fields.ckeditor import CKEditorField
from core.fields.json_editor import JSONEditorField


class ArchSectionAdmin(ModelView, model=Sections):
    name = 'Секция'
    name_plural = 'Секции'
    icon = 'fa-solid fa-layer-group'

    column_list = [
        Sections.id,
        Sections.name,
        Sections.type,
        Sections.order,
        Sections.template_id,
    ]
    column_searchable_list = [Sections.name]
    column_sortable_list = [Sections.id, Sections.name, Sections.order, Sections.type]

    form_columns = [
        Sections.template,
        Sections.name,
        Sections.description,
        Sections.order,
        Sections.type,
        Sections.score_scale,
    ]
    form_overrides = {
        'description': CKEditorField,
        'score_scale': JSONEditorField,
    }
    form_args = {
        'description': {
            'label': 'Description',
            'render_kw': {'rows': 5},
        },
        'score_scale': {
            'label': 'Score Scale (1–5 items)',
            'validators': [validators.DataRequired()],
        },
        'type': {
            'label': 'Type',
            'choices': [(s.value, s.name) for s in SectionTypeEnum],
        },
    }
    form_ajax_refs = {
        'template': {
            'fields': ('name',),
            'order_by': 'name',
        }
    }

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    can_export = False

    async def on_model_change(self, data: dict, model: Sections, is_created: bool, request: Request) -> None:
        score = data.get('score_scale')
        if isinstance(score, list) and not (1 <= len(score) <= 5):
            raise ValueError('score_scale must contain between 1 and 5 items')
