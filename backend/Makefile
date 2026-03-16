.PHONY: run migrate revision downgrade shell

run:
	uv run python -m uvicorn main:app --reload --forwarded-allow-ips="*" --workers 4

migrate:
	uv run python -m alembic upgrade head

revision:
	uv run python -m alembic revision --autogenerate -m "$(m)"

downgrade:
	uv run python -m alembic downgrade -1

shell:
	uv run python
