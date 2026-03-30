from sqladmin import ModelView
from wtforms import validators

from arch.models import ArchRoomAnswers
from core.fields.ckeditor import CKEditorField


class ArchRoomAnswerAdmin(ModelView, model=ArchRoomAnswers):
    name = 'Ответ'
    name_plural = 'Ответы'
    icon = 'fa-solid fa-pen-to-square'

    column_list = [
        ArchRoomAnswers.id,
        ArchRoomAnswers.room_id,
        ArchRoomAnswers.section_id,
        ArchRoomAnswers.section_order,
        ArchRoomAnswers.mark,
    ]
    column_sortable_list = [
        ArchRoomAnswers.id,
        ArchRoomAnswers.room_id,
        ArchRoomAnswers.section_order,
        ArchRoomAnswers.mark,
    ]

    form_columns = [
        ArchRoomAnswers.room,
        ArchRoomAnswers.section,
        ArchRoomAnswers.candidate_answer,
        ArchRoomAnswers.reviewer_comment,
        ArchRoomAnswers.mark,
    ]
    form_overrides = {
        'candidate_answer': CKEditorField,
        'reviewer_comment': CKEditorField,
    }
    form_args = {
        'candidate_answer': {'label': 'Ответ кандидата', 'render_kw': {'rows': 6}},
        'reviewer_comment': {'label': 'Комментарий ревьюера', 'render_kw': {'rows': 4}},
        'mark': {
            'label': 'Оценка (1–5)',
            'validators': [validators.NumberRange(min=1, max=5)],
        },
    }

    # Запрещаем создание вручную — только через Room
    can_create = False
    can_edit = True
    can_delete = False
    can_view_details = True
    can_export = False
