from enum import StrEnum


class WayDecisionEnum(StrEnum):
    HIRED = 'HIRED'
    REJECTED = 'REJECTED'
    IN_PROGRESS = 'IN_PROGRESS'
    ON_HOLD = 'ON_HOLD'


class WayStatusEnum(StrEnum):
    ACTIVE = 'ACTIVE'
    COMPLETED = 'COMPLETED'
    CANCELLED = 'CANCELLED'


class SectionTypeEnum(StrEnum):
    HR = 'HR'
    TECH = 'TECH'
    SD = 'SYSTEM_DESIGN'
    TEAM = 'TEAM'


class SectionDecisionEnum(StrEnum):
    REFUSE = 'REFUSE'
    RECOMMENDED = 'RECOMMENDED'
    PENDING = 'PENDING'


class SectionStatusEnum(StrEnum):
    NEW = 'NEW'
    IN_PROGRESS = 'IN_PROGRESS'
    END = 'END'
