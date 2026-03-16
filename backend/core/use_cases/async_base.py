from sqlalchemy.ext.asyncio import AsyncSession


class AsyncUseCase:
    def __init__(self, session: AsyncSession):
        self.session = session


class RepositoryAsync:
    def __init__(self, session: AsyncSession):
        self.session = session
