from arch.repositories.room_answers import RoomAnswersRepository
from core.use_cases.async_base import AsyncUseCase


class ReviewUpdaterAsyncUseCase(AsyncUseCase):
    def __init__(
        self,
        *args,
        answer_id: int,
        review: str,
        mark: int | None,
        room_ans_repo: type[RoomAnswersRepository] = RoomAnswersRepository,
    ) -> None:
        super().__init__(*args)
        self.answer_id = answer_id
        self.review = review
        self.mark = mark
        self.room_ans_repo = RoomAnswersRepository(self.session)

    async def execute(self):
        await self.room_ans_repo.update_review(self.answer_id, self.review, self.mark)
