from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqladmin import Admin
from starlette.middleware.gzip import GZipMiddleware

from arch.api.routes import router as api_router
from arch.websocket.routes import router as websocket_router
from flow.api.routes import router as flow_router
from settings.db import engine

app = FastAPI(title='My Architecture App')
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
app.mount('/static', StaticFiles(directory='static'), name='static')
app.include_router(websocket_router)
app.include_router(api_router)
app.include_router(flow_router)

from arch.admin import (
    RoomAdmin,
    RoomAnswerAdmin,
    SectionAdmin,
    TaskAdmin,
    TemplateAdmin,
)  #  noqa:E402
from core.admin import TagsAdmin  #  noqa:E402
from flow.admin import (
    CandidatesAdmin,
    CandidateWaysAdmin,
    CandidateWaySectionsAdmin,
    CandidateWayTagsAdmin,
)  #  noqa:E402

admin = Admin(app, engine, title='Arch Admin', base_url='/admin')
admin.add_view(TaskAdmin)
admin.add_view(TemplateAdmin)
admin.add_view(SectionAdmin)
admin.add_view(RoomAnswerAdmin)
admin.add_view(RoomAdmin)
# Core
admin.add_view(TagsAdmin)
# Flow
admin.add_view(CandidatesAdmin)
admin.add_view(CandidateWaysAdmin)
admin.add_view(CandidateWayTagsAdmin)
admin.add_view(CandidateWaySectionsAdmin)
