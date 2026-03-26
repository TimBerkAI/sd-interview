"""0002_data_app_arch

Revision ID: 8d884983367d
Revises: 1d329a1f11ea
Create Date: 2026-03-13 17:48:06.531473

"""

import json
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '8d884983367d'
down_revision: Union[str, Sequence[str], None] = '1d329a1f11ea'
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
         'CONFIRMED'::task_status),
        (2, 'Проектирование ленты новостей', 'news-feed',
         'Спроектируй систему формирования ленты новостей (аналог Twitter Feed).',
         'CONFIRMED'::task_status),
        (3, 'Проектирование системы чатов', 'chat-system',
         'Спроектируй real-time систему обмена сообщениями (аналог Telegram).',
         'CONFIRMED'::task_status)
        ON CONFLICT (id) DO NOTHING
    """)
    )

    # Templates
    conn.execute(
        sa.text("""
        INSERT INTO templates (id, name, specialty, status) VALUES
        (1, 'Backend System Design — Base', 'BE'::specialty, 'CONFIRMED'::template_status)
        ON CONFLICT (id) DO NOTHING
    """)
    )

    # Sections — JSONB передаём через bind параметр
    score_json = json.dumps(SCORE_SCALE_DEFAULT, ensure_ascii=False)
    conn.execute(
        sa.text("""
        INSERT INTO sections (id, template_id, name, description, "order", type, score_scale) VALUES
        (1, 1, 'Требования',        'Функциональные и нефункциональные требования. DAU/MAU, RPS.', 1, 'REQUIREMENTS'::section_type,  :score),
        (2, 1, 'Расчёты нагрузки', 'Back-of-the-envelope: RPS, bandwidth, storage.',               2, 'CALCULATION'::section_type,  :score),
        (3, 1, 'API Design',        'Ключевые эндпоинты: метод, путь, параметры, ответ.',          3, 'API'::section_type,           :score),
        (4, 1, 'Модель данных',     'Схема БД. Выбор хранилища (SQL/NoSQL/Cache).',                4, 'DATA_MODEL'::section_type,    :score),
        (5, 1, 'HLD',               'Компонентная схема. Основные сервисы и взаимодействие.',      5, 'HLD'::section_type,           :score),
        (6, 1, 'LLD',               'Детальное описание компонентов: алгоритмы, структуры данных.',6, 'LLD'::section_type,           :score),
        (7, 1, 'Риски',             'SPOF, bottleneck-и, стратегии масштабирования.',              7, 'RISKS'::section_type,         :score)
        ON CONFLICT (id) DO NOTHING
    """),
        {'score': score_json},
    )


def downgrade() -> None:
    op.execute('TRUNCATE sections CASCADE RESTART IDENTITY')
    op.execute('TRUNCATE templates CASCADE RESTART IDENTITY')
    op.execute('TRUNCATE tasks CASCADE RESTART IDENTITY')
