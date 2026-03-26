from sqladmin import ModelView

from core.fields.ckeditor import CKEditorField
from core.fields.json_editor import JSONEditorField
from flow.models import Candidates


class CandidatesAdmin(ModelView, model=Candidates):
    name = 'Кандидат'
    name_plural = 'Кандидаты'
    icon = 'fa-solid fa-user'

    column_list = [
        Candidates.id,
        Candidates.full_name,
        Candidates.specialty,
        Candidates.created_at,
    ]
    column_searchable_list = [
        Candidates.full_name,
    ]
    column_sortable_list = [
        Candidates.id,
        Candidates.full_name,
        Candidates.specialty,
        Candidates.created_at,
    ]
    form_overrides = {
        'description': CKEditorField,
        'links': JSONEditorField,
    }
    form_columns = [
        Candidates.full_name,
        Candidates.description,
        Candidates.specialty,
        Candidates.links,
    ]
    column_details_list = [
        Candidates.id,
        Candidates.full_name,
        Candidates.description,
        Candidates.specialty,
        Candidates.links,
        Candidates.created_at,
    ]
