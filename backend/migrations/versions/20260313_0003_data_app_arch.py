"""0002_data_app_arch

Revision ID: 8d884983367d
Revises: 6d59e482783e
Create Date: 2026-03-13 22:41:57.363541

"""

import json
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '8d884983367d'
down_revision: Union[str, Sequence[str], None] = '6d59e482783e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


SCORE_SCALE_DEFAULT = [
    {'score': 1, 'comment': 'Не раскрыто'},
    {'score': 2, 'comment': 'Поверхностно'},
    {'score': 3, 'comment': 'Удовлетворительно'},
    {'score': 4, 'comment': 'Хорошо'},
    {'score': 5, 'comment': 'Отлично'},
]


def upgrade() -> None:
    conn = op.get_bind()

    # Tasks
    conn.execute(
        sa.text("""
        INSERT INTO tasks (id, name, slug, description, status) VALUES
        (1, 'Проектирование URL Shortener', 'url-shortener',
         'Спроектируй сервис сокращения ссылок (аналог bit.ly).',
         'CONFIRMED'::arch_task_status),
        (2, 'Проектирование ленты новостей', 'news-feed',
         'Спроектируй систему формирования ленты новостей (аналог Twitter Feed).',
         'CONFIRMED'::arch_task_status),
        (3, 'Проектирование системы чатов', 'chat-system',
         'Спроектируй real-time систему обмена сообщениями (аналог Telegram).',
         'CONFIRMED'::arch_task_status)
        ON CONFLICT (id) DO NOTHING
    """)
    )

    # Templates
    conn.execute(
        sa.text("""
        INSERT INTO templates (id, name, specialty, status) VALUES
        (1, 'Backend System Design — Base', 'BE'::arch_specialty, 'CONFIRMED'::arch_template_status)
        ON CONFLICT (id) DO NOTHING
    """)
    )

    # Sections — JSONB передаём через bind параметр
    score_json = json.dumps(SCORE_SCALE_DEFAULT, ensure_ascii=False)
    conn.execute(
        sa.text("""
        INSERT INTO sections (id, template_id, name, description, "order", type, score_scale) VALUES
        (1, 1, 'Требования',        'Функциональные и нефункциональные требования. DAU/MAU, RPS.', 1, 'REQUIREMENTS'::arch_section_type,  :score),
        (2, 1, 'Расчёты нагрузки', 'Back-of-the-envelope: RPS, bandwidth, storage.',               2, 'CALCULATION'::arch_section_type,  :score),
        (3, 1, 'API Design',        'Ключевые эндпоинты: метод, путь, параметры, ответ.',          3, 'API'::arch_section_type,           :score),
        (4, 1, 'Модель данных',     'Схема БД. Выбор хранилища (SQL/NoSQL/Cache).',                4, 'DATA_MODEL'::arch_section_type,    :score),
        (5, 1, 'HLD',               'Компонентная схема. Основные сервисы и взаимодействие.',      5, 'HLD'::arch_section_type,           :score),
        (6, 1, 'LLD',               'Детальное описание компонентов: алгоритмы, структуры данных.',6, 'LLD'::arch_section_type,           :score),
        (7, 1, 'Риски',             'SPOF, bottleneck-и, стратегии масштабирования.',              7, 'RISKS'::arch_section_type,         :score)
        ON CONFLICT (id) DO NOTHING
    """),
        {'score': score_json},
    )

    # Rooms
    conn.execute(
        sa.text("""
        INSERT INTO public.rooms
        (id, "name", task_id, template_id, started_at, ended_at, candidate_token, reviewer_token, status)
        VALUES
        (1, 'Test', 1, 1, now(), now(), 'candidate_demo_token_12345', 'reviewer_demo_token_67890', 'PENDING'::arch_room_status)
        ON CONFLICT (id) DO NOTHING
    """)
    )

    # Room answers
    conn.execute(
        sa.text("""
        INSERT INTO public.room_answers (id, room_id, section_id, section_order) VALUES
        (1, 1, 1, 1),
        (2, 1, 2, 2),
        (3, 1, 3, 3),
        (4, 1, 4, 4),
        (5, 1, 5, 5),
        (6, 1, 6, 6),
        (7, 1, 7, 7)
        ON CONFLICT (id) DO NOTHING
    """)
    )


def downgrade() -> None:
    op.execute('TRUNCATE room_answers RESTART IDENTITY CASCADE')
    op.execute('TRUNCATE rooms RESTART IDENTITY CASCADE')
    op.execute('TRUNCATE sections RESTART IDENTITY CASCADE')
    op.execute('TRUNCATE templates RESTART IDENTITY CASCADE')
    op.execute('TRUNCATE tasks RESTART IDENTITY CASCADE')
