from enum import StrEnum


class TaskTypeEnum(StrEnum):
    THEORY = 'THEORY'
    PRACTICE = 'PRACTICE'


class TaskStatusEnum(StrEnum):
    DRAFT = 'DRAFT'
    AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION'
    CONFIRMED = 'CONFIRMED'
    ARCHIVED = 'ARCHIVED'


class RoomStatusEnum(StrEnum):
    PENDING = 'PENDING'
    ACTIVE = 'ACTIVE'
    COMPLETED = 'COMPLETED'
    CANCELLED = 'CANCELLED'
