"""0007_data_tech_app

Revision ID: c99a54247f7a
Revises: 0ebd00ac782e
Create Date: 2026-03-28 20:02:54.070130

"""

import json
from datetime import datetime, timedelta
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'c99a54247f7a'
down_revision: Union[str, Sequence[str], None] = '0ebd00ac782e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


TASKS = [
    {
        'name': 'Конкурентность в Python и GIL',
        'specialty': 'BE',
        'type': 'THEORY',
        'description': 'Объясните, что такое GIL, как работает event loop в asyncio, чем отличаются CPU-bound и IO-bound нагрузки, и когда в backend-сервисах стоит использовать multiprocessing, threading или async IO.',
        'score_scale': [
            {'score': 1, 'comment': 'Знает только поверхностные определения.'},
            {
                'score': 2,
                'comment': 'Может отдельно объяснить GIL или asyncio, но не понимает компромиссы и trade-offs.',
            },
            {
                'score': 3,
                'comment': 'Объясняет event loop, блокирующие вызовы и выбор подхода под тип нагрузки, но с небольшими пробелами.',
            },
            {
                'score': 4,
                'comment': 'Уверенно сравнивает threading, multiprocessing, asyncio и приводит практические backend-примеры.',
            },
            {
                'score': 5,
                'comment': 'Дает глубокое объяснение с примерами из production, ограничениями и влиянием на производительность.',
            },
        ],
        'status': 'CONFIRMED',
    },
    {
        'name': 'Спроектировать FastAPI-сервис для асинхронных уведомлений',
        'specialty': 'BE',
        'type': 'PRACTICE',
        'description': 'Спроектируйте FastAPI-сервис, который принимает запросы на отправку уведомлений, валидирует payload, сохраняет задания в PostgreSQL, асинхронно отправляет их, а также поддерживает retry, идемпотентность и наблюдаемость.',
        'score_scale': [
            {'score': 1, 'comment': 'Нет структурированного дизайна, упущены хранение данных и гарантии доставки.'},
            {
                'score': 2,
                'comment': 'Есть базовая идея API, но отсутствуют retry, идемпотентность или архитектура воркеров.',
            },
            {'score': 3, 'comment': 'Покрывает API, базу данных и поток работы воркеров с приемлемыми trade-offs.'},
            {
                'score': 4,
                'comment': 'Учитывает обработку ошибок, retry, наблюдаемость, масштабирование и детали схемы данных.',
            },
            {
                'score': 5,
                'comment': 'Предлагает production-ready дизайн с разбором операционных trade-offs и edge cases.',
            },
        ],
        'status': 'CONFIRMED',
    },
    {
        'name': 'Индексы и планирование запросов в PostgreSQL',
        'specialty': 'BE',
        'type': 'THEORY',
        'description': 'Расскажите про btree, gin, partial indexes, composite indexes, EXPLAIN ANALYZE, selectivity и подходы к оптимизации медленных запросов в API на PostgreSQL.',
        'score_scale': [
            {'score': 1, 'comment': 'Знает, что индексы существуют, но не может объяснить, как они применяются.'},
            {
                'score': 2,
                'comment': 'Понимает только простые индексы, но не поведение planner и не способы диагностики.',
            },
            {
                'score': 3,
                'comment': 'Умеет читать EXPLAIN ANALYZE и предлагать полезные индексы для типовых сценариев.',
            },
            {
                'score': 4,
                'comment': 'Понимает selectivity, partial/composite indexes и стратегии переписывания запросов.',
            },
            {
                'score': 5,
                'comment': 'Показывает сильный production-подход к тюнингу с метриками, пониманием planner и trade-offs.',
            },
        ],
        'status': 'CONFIRMED',
    },
    {
        'name': 'Проектирование схемы для платформы собеседований',
        'specialty': 'BE',
        'type': 'PRACTICE',
        'description': 'Спроектируйте PostgreSQL-схему и API-контракты FastAPI для комнат, задач, ответов, reviewer feedback, токенов и переходов статусов в платформе технических собеседований.',
        'score_scale': [
            {'score': 1, 'comment': 'Схема неполная и не отражает процесс проведения собеседования.'},
            {'score': 2, 'comment': 'Базовые сущности есть, но ограничения и переходы состояний проработаны слабо.'},
            {'score': 3, 'comment': 'Предлагает разумную схему со связями, статусами и границами API.'},
            {
                'score': 4,
                'comment': 'Хорошо прорабатывает нормализацию, ограничения, управление процессом и практичный дизайн endpoint-ов.',
            },
            {
                'score': 5,
                'comment': 'Предлагает production-ready дизайн с учетом консистентности, прав доступа и расширяемости.',
            },
        ],
        'status': 'CONFIRMED',
    },
]

ROOM = {
    'name': 'Backend-Python Developer Senior - Test Room',
    'description': 'Test technical interview room for Backend-Python Senior candidate. Includes theory and practical tasks focused on Python, FastAPI, and PostgreSQL.',
    'started_at': datetime.now(),
    'ended_at': datetime.now() + timedelta(hours=1, minutes=30),
    'candidate_token': 'candidate-backend-python-senior-demo',
    'reviewer_token': 'reviewer-backend-python-senior-demo',
    'status': 'PENDING',
}

ANSWER_TEMPLATES = [
    {
        'order': 1,
        'candidate_answer': None,
        'reviewer_comment': None,
        'score': None,
    },
    {
        'order': 2,
        'candidate_answer': None,
        'reviewer_comment': None,
        'score': None,
    },
    {
        'order': 3,
        'candidate_answer': None,
        'reviewer_comment': None,
        'score': None,
    },
    {
        'order': 4,
        'candidate_answer': None,
        'reviewer_comment': None,
        'score': None,
    },
]


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    conn = op.get_bind()

    inserted_task_ids = []
    for task in TASKS:
        task_id = conn.execute(
            sa.text(
                """
                INSERT INTO tech_tasks (name, specialty, type, description, score_scale, status)
                VALUES (:name, :specialty, :type, :description, CAST(:score_scale AS jsonb), :status)
                RETURNING id
                """
            ),
            {
                'name': task['name'],
                'specialty': task['specialty'],
                'type': task['type'],
                'description': task['description'],
                'score_scale': postgresql.JSONB().bind_processor(conn.dialect)(task['score_scale']),
                'status': task['status'],
            },
        ).scalar_one()
        inserted_task_ids.append(task_id)

    room_id = conn.execute(
        sa.text(
            """
            INSERT INTO tech_rooms (
                name,
                description,
                started_at,
                ended_at,
                candidate_token,
                reviewer_token,
                status
            )
            VALUES (
                :name,
                :description,
                :started_at,
                :ended_at,
                :candidate_token,
                :reviewer_token,
                :status
            )
            RETURNING id
            """
        ),
        ROOM,
    ).scalar_one()

    for task_id in inserted_task_ids:
        conn.execute(
            sa.text(
                """
                INSERT INTO tech_room_tasks (room_id, task_id)
                VALUES (:room_id, :task_id)
                """
            ),
            {'room_id': room_id, 'task_id': task_id},
        )

    for task_id, answer in zip(inserted_task_ids, ANSWER_TEMPLATES, strict=False):
        conn.execute(
            sa.text(
                """
                INSERT INTO tech_room_answers (
                    room_id,
                    task_id,
                    "order",
                    candidate_answer,
                    reviewer_comment,
                    score
                )
                VALUES (
                    :room_id,
                    :task_id,
                    :order,
                    :candidate_answer,
                    :reviewer_comment,
                    CAST(:score AS jsonb)
                )
                """
            ),
            {
                'room_id': room_id,
                'task_id': task_id,
                'order': answer['order'],
                'candidate_answer': answer['candidate_answer'],
                'reviewer_comment': answer['reviewer_comment'],
                'score': postgresql.JSONB().bind_processor(conn.dialect)(answer['score'])
                if answer['score'] is not None
                else 'null',
            },
        )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.execute('TRUNCATE tech_room_answers RESTART IDENTITY CASCADE')
    op.execute('TRUNCATE tech_rooms RESTART IDENTITY CASCADE')
    op.execute('TRUNCATE tech_tasks RESTART IDENTITY CASCADE')
    # ### end Alembic commands ###
