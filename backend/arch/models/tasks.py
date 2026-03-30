from settings.db import Base
from sqlalchemy import Enum as SAEnum
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from arch.enums import TaskStatusEnum


class ArchTasks(Base):
    __tablename__ = 'tasks'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[TaskStatusEnum] = mapped_column(
        SAEnum(TaskStatusEnum, name='arch_task_status'),
        nullable=False,
        default=TaskStatusEnum.DRAFT,
    )

    def __repr__(self) -> str:
        return self.name
