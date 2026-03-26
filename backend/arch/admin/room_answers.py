from sqladmin import ModelView
from wtforms import validators

from arch.models import RoomAnswers
from core.fields.ckeditor import CKEditorField


class RoomAnswerAdmin(ModelView, model=RoomAnswers):
    name = 'Ответ'
    name_plural = 'Ответы'
    icon = 'fa-solid fa-pen-to-square'

    column_list = [
        RoomAnswers.id,
        RoomAnswers.room_id,
        RoomAnswers.section_id,
        RoomAnswers.section_order,
        RoomAnswers.mark,
    ]
    column_sortable_list = [
        RoomAnswers.id,
        RoomAnswers.room_id,
        RoomAnswers.section_order,
        RoomAnswers.mark,
    ]

    form_columns = [
        RoomAnswers.room,
        RoomAnswers.section,
        RoomAnswers.candidate_answer,
        RoomAnswers.reviewer_comment,
        RoomAnswers.mark,
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
