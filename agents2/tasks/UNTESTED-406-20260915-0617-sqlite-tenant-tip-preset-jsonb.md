# SQLite tests: map tenant tip presets without postgres-only JSONB (#406)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/406
- **406**

## Status
- **Implemented:** 2026-09-15T06:22:00Z
- Model-only dialect fallback: `PgJSON = JSON().with_variant(JSONB(), "postgresql")` for Tenant `tip_preset_percents`, `ui_modules`, and `custom_subcategories` (all three blocked SQLite `create_all`). No migration change. Postgres still uses JSONB.

## Problem / goal
Reservation pytest files that create the `tenant` table fail on SQLite because `Tenant.tip_preset_percents` compiles as postgres `JSONB`. The suite uses SQLite in the back container. Product runtime stays PostgreSQL; this is a test-dialect mapping bug.

Failing modules (at least): `tests/test_reservation_book_zones_public.py`, `tests/test_reservation_floor_seating_zone.py` — `CompileError` / missing `visit_JSONB`.

Column comes from `back/migrations/20260323140000_tenant_tip_presets_and_order_tip.sql` and `Tenant.tip_preset_percents` in `back/app/models.py`. Tip presets behaviour: `docs/REVOLUT.md` (Settings presets, mark-paid / finish).

## High-level instructions for coder
- Reproduce: `docker exec pos-back python -m pytest tests/test_reservation_book_zones_public.py tests/test_reservation_floor_seating_zone.py -q`.
- Map `tip_preset_percents` with SQLAlchemy `JSON` or a `Variant` / TypeDecorator that SQLite can compile. Do not change postgres migration history unless a new migration is required for live DBs (prefer model-only dialect fallback).
- Keep postgres JSON storage and app read/write of the preset list unchanged.
- Re-run the two modules (and a broader pytest slice if time allows) until those five tests no longer fail on JSONB compile.
- Do not mix in unrelated failures from the same suite.

## Testing instructions
1. In `pos-back`: `python -m pytest tests/test_reservation_book_zones_public.py tests/test_reservation_floor_seating_zone.py -q` — expect **5 passed** (no `CompileError` / `visit_JSONB`).
2. Optional: `python -m pytest tests/test_reservable_capacity_turn_walkin.py tests/test_order_tip.py -q` — expect pass (SQLite DDL + tip presets still work).
3. Confirm no new migration under `back/migrations/` for this change; live DBs keep existing JSONB column from `20260323140000_tenant_tip_presets_and_order_tip.sql`.
