from core.enums import SpecialityEnum
from pydantic import BaseModel, ConfigDict
from tech.enums import TaskStatusEnum, TaskTypeEnum


class TaskCreateDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    slug: str
    specialty: SpecialityEnum
    tag_ids: list[int] = []
    type: TaskTypeEnum
    description: str | None = None
    evaluation: dict
    status: TaskStatusEnum = TaskStatusEnum.DRAFT


class TaskUpdateDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str | None = None
    slug: str | None = None
    specialty: SpecialityEnum | None = None
    tag_ids: list[int] | None = None
    type: TaskTypeEnum | None = None
    description: str | None = None
    evaluation: dict | None = None
    status: TaskStatusEnum | None = None


class TaskDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    specialty: SpecialityEnum
    type: TaskTypeEnum
    description: str | None = None
    evaluation: dict
    status: TaskStatusEnum
