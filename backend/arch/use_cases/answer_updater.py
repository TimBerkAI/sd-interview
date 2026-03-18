from arch.repositories.room_answers import RoomAnswersRepository
from core.use_cases.async_base import AsyncUseCase


class AnswerUpdaterAsyncUseCase(AsyncUseCase):
    def __init__(
        self,
        *args,
        answer_id: int,
        answer: str,
        room_ans_repo: type[RoomAnswersRepository] = RoomAnswersRepository,
    ) -> None:
        super().__init__(*args)
        self.answer_id = answer_id
        self.answer = answer
        self.room_ans_repo = RoomAnswersRepository(self.session)

    async def execute(self):
        await self.room_ans_repo.update_candidate_answer(self.answer_id, self.answer)
