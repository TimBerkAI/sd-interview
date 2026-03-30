from sqladmin import ModelView

from tech.models import TechRoomAnswers, TechRooms, TechTasks


class TechTasksAdmin(ModelView, model=TechTasks):
    name = 'Тех. задача'
    name_plural = 'Тех. задачи'
    icon = 'fa-solid fa-list-check'
    column_list = (TechTasks.id, TechTasks.name, TechTasks.specialty, TechTasks.type, TechTasks.status)
    column_details_list = (
        TechTasks.id,
        TechTasks.name,
        TechTasks.specialty,
        TechTasks.tags,
        TechTasks.type,
        TechTasks.description,
        TechTasks.score_scale,
        TechTasks.status,
    )
    form_columns = (
        TechTasks.name,
        TechTasks.specialty,
        TechTasks.tags,
        TechTasks.type,
        TechTasks.description,
        TechTasks.score_scale,
        TechTasks.status,
    )
    column_searchable_list = (TechTasks.name, TechTasks.description)
    column_sortable_list = (TechTasks.id, TechTasks.name, TechTasks.status)


class TechRoomsAdmin(ModelView, model=TechRooms):
    name = 'Тех. комната'
    name_plural = 'Тех. комнаты'
    icon = 'fa-solid fa-person-booth'
    column_list = (TechRooms.id, TechRooms.name, TechRooms.started_at, TechRooms.ended_at, TechRooms.status)
    column_details_list = (
        TechRooms.id,
        TechRooms.name,
        TechRooms.description,
        TechRooms.started_at,
        TechRooms.ended_at,
        TechRooms.candidate_token,
        TechRooms.reviewer_token,
        TechRooms.status,
        TechRooms.tasks,
    )
    form_columns = (
        TechRooms.name,
        TechRooms.description,
        TechRooms.started_at,
        TechRooms.ended_at,
        TechRooms.status,
        TechRooms.tasks,
    )
    column_searchable_list = (
        TechRooms.name,
        TechRooms.description,
        TechRooms.candidate_token,
        TechRooms.reviewer_token,
    )
    column_sortable_list = (TechRooms.id, TechRooms.name, TechRooms.started_at, TechRooms.ended_at, TechRooms.status)


class TechRoomAnswersAdmin(ModelView, model=TechRoomAnswers):
    name = 'Тех. ответ'
    name_plural = 'Тех. ответы'
    icon = 'fa-solid fa-comment-dots'
    can_create = False
    column_list = (
        TechRoomAnswers.id,
        TechRoomAnswers.room,
        TechRoomAnswers.task,
        TechRoomAnswers.order,
        TechRoomAnswers.score,
    )
    column_details_list = (
        TechRoomAnswers.id,
        TechRoomAnswers.room,
        TechRoomAnswers.task,
        TechRoomAnswers.order,
        TechRoomAnswers.candidate_answer,
        TechRoomAnswers.reviewer_comment,
        TechRoomAnswers.score,
    )
    form_columns = (
        TechRoomAnswers.room,
        TechRoomAnswers.task,
        TechRoomAnswers.order,
        TechRoomAnswers.candidate_answer,
        TechRoomAnswers.reviewer_comment,
        TechRoomAnswers.score,
    )
    column_sortable_list = (TechRoomAnswers.id, TechRoomAnswers.order)
