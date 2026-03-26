from sqladmin import ModelView

from flow.models.candidate_ways import CandidateWays, CandidateWayTags


class CandidateWaysAdmin(ModelView, model=CandidateWays):
    name = 'Путь кандидата'
    name_plural = 'Пути кандидата'
    icon = 'fa-solid fa-road'

    column_list = [
        CandidateWays.id,
        CandidateWays.candidate_id,
        CandidateWays.specialty,
        CandidateWays.decision,
        CandidateWays.status,
        CandidateWays.period_start,
        CandidateWays.period_end,
        CandidateWays.created_at,
    ]
    column_searchable_list = [
        CandidateWays.candidate_id,
    ]
    column_sortable_list = [
        CandidateWays.id,
        CandidateWays.specialty,
        CandidateWays.decision,
        CandidateWays.status,
        CandidateWays.period_start,
        CandidateWays.created_at,
    ]
    form_columns = [
        CandidateWays.candidate_id,
        CandidateWays.specialty,
        CandidateWays.decision,
        CandidateWays.status,
        CandidateWays.period_start,
        CandidateWays.period_end,
        CandidateWays.tags,
    ]
    column_details_list = [
        CandidateWays.id,
        CandidateWays.candidate_id,
        CandidateWays.specialty,
        CandidateWays.decision,
        CandidateWays.status,
        CandidateWays.period_start,
        CandidateWays.period_end,
        CandidateWays.tags,
        CandidateWays.created_at,
    ]


class CandidateWayTagsAdmin(ModelView, model=CandidateWayTags):
    name = 'Тэг пути'
    name_plural = 'Тэги пути'
    icon = 'fa-solid fa-link'

    column_list = [
        CandidateWayTags.id,
        CandidateWayTags.way_id,
        CandidateWayTags.tag_id,
    ]
    column_sortable_list = [
        CandidateWayTags.id,
        CandidateWayTags.way_id,
        CandidateWayTags.tag_id,
    ]
    form_columns = [CandidateWayTags.way_id, CandidateWayTags.tag_id]
