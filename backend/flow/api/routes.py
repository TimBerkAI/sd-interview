from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from flow.api.schemas import SectionUpdateSchema, WayUpdateSchema
from flow.use_cases.candidate_detail import CandidateDetailAsyncUseCase
from flow.use_cases.candidate_list import CandidateListAsyncUseCase
from flow.use_cases.candidate_way_detail import CandidateWayDetailAsyncUseCase
from flow.use_cases.candidate_way_list import CandidateWayListAsyncUseCase
from flow.use_cases.candidate_way_section_updater import (
    CandidateWaySectionUpdaterAsyncUseCase,
)
from flow.use_cases.candidate_way_updater import CandidateWayUpdaterAsyncUseCase
from settings.db import get_session

router = APIRouter(prefix='/api/v1/flow')


@router.get('/candidates/')
async def list_candidates(session: AsyncSession = Depends(get_session)):
    use_case = CandidateListAsyncUseCase(session)
    return await use_case.execute()


@router.get('/candidates/{candidate_id}/')
async def get_candidate(candidate_id: int, session: AsyncSession = Depends(get_session)):
    use_case = CandidateDetailAsyncUseCase(session, record_id=candidate_id)
    candidate = await use_case.execute()
    if not candidate:
        raise HTTPException(status_code=404, detail='Candidate not found')
    return candidate


@router.get('/ways/')
async def list_ways(session: AsyncSession = Depends(get_session)):
    use_case = CandidateWayListAsyncUseCase(session)
    return await use_case.execute()


@router.get('/ways/{way_id}/')
async def get_way(way_id: int, session: AsyncSession = Depends(get_session)):
    use_case = CandidateWayDetailAsyncUseCase(session, record_id=way_id)
    way = await use_case.execute()
    if not way:
        raise HTTPException(status_code=404, detail='Way not found')
    return way


@router.put('/ways/{way_id}/')
async def update_way(
    way_id: int,
    update: WayUpdateSchema,
    session: AsyncSession = Depends(get_session),
):
    use_case = CandidateWayUpdaterAsyncUseCase(session, record_id=way_id, data=update)
    result = await use_case.execute()
    if not result:
        raise HTTPException(status_code=404, detail='Way not found')
    return {'success': True}


@router.put('/sections/{section_id}/')
async def update_section(
    section_id: int,
    update: SectionUpdateSchema,
    session: AsyncSession = Depends(get_session),
):
    use_case = CandidateWaySectionUpdaterAsyncUseCase(session, record_id=section_id, data=update)
    result = await use_case.execute()
    if not result:
        raise HTTPException(status_code=404, detail='Section not found')
    return {'success': True}
