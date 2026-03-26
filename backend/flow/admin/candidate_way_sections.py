from sqladmin import ModelView

from core.fields.ckeditor import CKEditorField
from core.fields.json_editor import JSONEditorField
from flow.models import CandidateWaySections


class CandidateWaySectionsAdmin(ModelView, model=CandidateWaySections):
    name = 'Секция пути'
    name_plural = 'Секции пути'
    icon = 'fa-solid fa-list-check'

    column_list = [
        CandidateWaySections.id,
        CandidateWaySections.way_id,
        CandidateWaySections.name,
        CandidateWaySections.type,
        CandidateWaySections.status,
        CandidateWaySections.decision,
        CandidateWaySections.sort_order,
    ]
    column_searchable_list = [
        CandidateWaySections.name,
    ]
    column_sortable_list = [
        CandidateWaySections.id,
        CandidateWaySections.sort_order,
        CandidateWaySections.type,
        CandidateWaySections.status,
        CandidateWaySections.decision,
    ]
    form_columns = [
        CandidateWaySections.way_id,
        CandidateWaySections.name,
        CandidateWaySections.type,
        CandidateWaySections.status,
        CandidateWaySections.decision,
        CandidateWaySections.review,
        CandidateWaySections.sort_order,
        CandidateWaySections.skill_assessments,
    ]
    form_overrides = {
        'review': CKEditorField,
        'skill_assessments': JSONEditorField,
    }
    column_details_list = [
        CandidateWaySections.id,
        CandidateWaySections.way_id,
        CandidateWaySections.name,
        CandidateWaySections.type,
        CandidateWaySections.status,
        CandidateWaySections.decision,
        CandidateWaySections.review,
        CandidateWaySections.sort_order,
        CandidateWaySections.skill_assessments,
    ]
