"""0005_data_flow_app

Revision ID: 9b2d3c99511a
Revises: 0717870cbe0b
Create Date: 2026-03-21 13:16:28.715209
"""

import datetime
from typing import Sequence, Union

from alembic import op
from sqlalchemy import Date, DateTime, Integer, String, Text, column, table
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB

revision: str = '9b2d3c99511a'
down_revision: Union[str, Sequence[str], None] = '0717870cbe0b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# ---------------------------------------------------------------------------
# Light-таблицы для bulk_insert
# ---------------------------------------------------------------------------

candidates_table = table(
    'candidates',
    column('id', Integer),
    column('full_name', String),
    column('description', Text),
    column('specialty', SAEnum(name='flow_candidate_specialty')),
    column('links', JSONB),
    column('created_at', DateTime),
)

candidate_ways_table = table(
    'candidate_ways',
    column('id', Integer),
    column('candidate_id', Integer),
    column('period_start', Date),
    column('period_end', Date),
    column('specialty', SAEnum(name='flow_way_specialty')),
    column('decision', SAEnum(name='flow_way_decision')),
    column('status', SAEnum(name='flow_way_status')),
    column('created_at', DateTime),
    # tags колонки нет — вынесена в отдельную таблицу
)

candidate_way_sections_table = table(
    'candidate_way_sections',
    column('id', Integer),
    column('way_id', Integer),
    column('name', String),
    column('type', SAEnum(name='flow_way_section_type')),
    column('status', SAEnum(name='flow_way_section_status')),
    column('review', Text),
    column('decision', SAEnum(name='flow_way_section_decision')),
    column('sort_order', Integer),
    column('skill_assessments', JSONB),
)

tags_table = table(
    'tags',
    column('id', Integer),
    column('name', String),
    column('color', String),
)

candidate_way_tags_table = table(
    'candidate_way_tags',
    column('id', Integer),
    column('way_id', Integer),
    column('tag_id', Integer),
)


def upgrade() -> None:
    now = datetime.datetime.utcnow()
    today = datetime.date.today()

    # ------------------------------------------------------------------
    # 1. Candidates
    # ------------------------------------------------------------------
    op.bulk_insert(
        candidates_table,
        [
            {
                'id': 1,
                'full_name': 'Иван Иванов',
                'description': 'Senior Python Backend Developer',
                'specialty': 'BE',
                'links': [
                    {'label': 'GitHub', 'url': 'https://github.com/ivanov'},
                    {'label': 'LinkedIn', 'url': 'https://linkedin.com/in/ivanov'},
                ],
                'created_at': now,
            },
            {
                'id': 2,
                'full_name': 'Мария Петрова',
                'description': 'Frontend React Developer',
                'specialty': 'FE',
                'links': [],
                'created_at': now,
            },
        ],
    )

    # ------------------------------------------------------------------
    # 2. CandidateWays (без tags)
    # ------------------------------------------------------------------
    op.bulk_insert(
        candidate_ways_table,
        [
            {
                'id': 1,
                'candidate_id': 1,
                'period_start': today,
                'period_end': None,
                'specialty': 'BE',
                'decision': 'IN_PROGRESS',
                'status': 'ACTIVE',
                'created_at': now,
            },
            {
                'id': 2,
                'candidate_id': 2,
                'period_start': today,
                'period_end': None,
                'specialty': 'FE',
                'decision': 'IN_PROGRESS',
                'status': 'ACTIVE',
                'created_at': now,
            },
        ],
    )

    # ------------------------------------------------------------------
    # 3. Tags — справочник
    # ------------------------------------------------------------------
    op.bulk_insert(
        tags_table,
        [
            {'id': 1, 'name': 'Python', 'color': '#3572A5'},
            {'id': 2, 'name': 'FastAPI', 'color': '#059669'},
            {'id': 3, 'name': 'React', 'color': '#61DAFB'},
            {'id': 4, 'name': 'TypeScript', 'color': '#3178C6'},
        ],
    )

    # ------------------------------------------------------------------
    # 4. CandidateWayTags — связи way ↔ tag
    # Way 1 (Иван): Python, FastAPI
    # Way 2 (Мария): React, TypeScript
    # ------------------------------------------------------------------
    op.bulk_insert(
        candidate_way_tags_table,
        [
            {'id': 1, 'way_id': 1, 'tag_id': 1},  # Way1 → Python
            {'id': 2, 'way_id': 1, 'tag_id': 2},  # Way1 → FastAPI
            {'id': 3, 'way_id': 2, 'tag_id': 3},  # Way2 → React
            {'id': 4, 'way_id': 2, 'tag_id': 4},  # Way2 → TypeScript
        ],
    )

    # ------------------------------------------------------------------
    # 5. CandidateWaySections
    # skill_assessments: {"skill", "score", "review"} — только HR и TEAM
    # ------------------------------------------------------------------
    op.bulk_insert(
        candidate_way_sections_table,
        [
            # --- Way 1 (Иван Иванов) ---
            {
                'id': 1,
                'way_id': 1,
                'name': 'HR Interview',
                'type': 'HR',
                'status': 'NEW',
                'review': None,
                'decision': 'PENDING',
                'sort_order': 0,
                'skill_assessments': [
                    {'skill': 'Коммуникация', 'score': None, 'review': None},
                    {'skill': 'Мотивация', 'score': None, 'review': None},
                    {'skill': 'Культурный фит', 'score': None, 'review': None},
                ],
            },
            {
                'id': 2,
                'way_id': 1,
                'name': 'Technical Interview',
                'type': 'TECH',
                'status': 'NEW',
                'review': None,
                'decision': 'PENDING',
                'sort_order': 1,
                'skill_assessments': [],
            },
            {
                'id': 3,
                'way_id': 1,
                'name': 'Team Interview',
                'type': 'TEAM',
                'status': 'NEW',
                'review': None,
                'decision': 'PENDING',
                'sort_order': 2,
                'skill_assessments': [
                    {'skill': 'Командная работа', 'score': None, 'review': None},
                    {'skill': 'Конфликтность', 'score': None, 'review': None},
                    {'skill': 'Инициативность', 'score': None, 'review': None},
                ],
            },
            # --- Way 2 (Мария Петрова) ---
            {
                'id': 4,
                'way_id': 2,
                'name': 'HR Interview',
                'type': 'HR',
                'status': 'NEW',
                'review': None,
                'decision': 'PENDING',
                'sort_order': 0,
                'skill_assessments': [
                    {'skill': 'Коммуникация', 'score': None, 'review': None},
                    {'skill': 'Мотивация', 'score': None, 'review': None},
                    {'skill': 'Культурный фит', 'score': None, 'review': None},
                ],
            },
            {
                'id': 5,
                'way_id': 2,
                'name': 'Team Interview',
                'type': 'TEAM',
                'status': 'NEW',
                'review': None,
                'decision': 'PENDING',
                'sort_order': 1,
                'skill_assessments': [
                    {'skill': 'Командная работа', 'score': None, 'review': None},
                    {'skill': 'Конфликтность', 'score': None, 'review': None},
                    {'skill': 'Инициативность', 'score': None, 'review': None},
                ],
            },
        ],
    )


def downgrade() -> None:
    # Обратный порядок: сначала зависимые таблицы
    op.execute('TRUNCATE TABLE candidate_way_sections RESTART IDENTITY CASCADE')
    op.execute('TRUNCATE TABLE candidate_way_tags RESTART IDENTITY CASCADE')
    op.execute('TRUNCATE TABLE candidate_ways RESTART IDENTITY CASCADE')
    op.execute('TRUNCATE TABLE tags RESTART IDENTITY CASCADE')
    op.execute('TRUNCATE TABLE candidates RESTART IDENTITY CASCADE')
