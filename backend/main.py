from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqladmin import Admin
from starlette.middleware.gzip import GZipMiddleware

from arch.api.routes import router as api_router
from arch.websocket.routes import router as websocket_router
from settings.db import engine

app = FastAPI(title="My Architecture App")
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(websocket_router)
app.include_router(api_router)

from arch.admin import (
    RoomAdmin,
    RoomAnswerAdmin,
    SectionAdmin,
    TaskAdmin,
    TemplateAdmin,
)  #  noqa:E402

admin = Admin(app, engine, title="Arch Admin", base_url="/admin")
admin.add_view(TaskAdmin)
admin.add_view(TemplateAdmin)
admin.add_view(SectionAdmin)
admin.add_view(RoomAnswerAdmin)
admin.add_view(RoomAdmin)
