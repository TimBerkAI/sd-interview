from fastapi import FastAPI
from sqladmin import Admin
from starlette.middleware.gzip import GZipMiddleware

from settings.db import engine

app = FastAPI(title="My Architecture App")
app.add_middleware(GZipMiddleware, minimum_size=1000)

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
