# Log how long a table was or has been Active (#389)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/389
- **389**

## Status
- **Started (WIP):** 2026-09-14T14:22:00Z
- **Implemented:** 2026-09-14T14:31:00Z

## Problem / goal
Staff need to see **how long** a table has been (or was) **Active**, and **when** that active period started (and ended if closed). Today activation is tracked for ordering (`is_active`, `activated_at` per `docs/0009-table-pin-security.md`), but the UI does not surface a clear duration / timeline for floor ops.

## High-level instructions for coder
- Confirm existing fields/APIs: `Table.activated_at`, `is_active`, close/deactivate paths in `docs/0009-table-pin-security.md` and table status endpoints (`GET /tables/with-status` and related). Prefer **displaying** existing timestamps over new schema unless a closed-session history is missing.
- Show active duration (and start time) where staff already see table status (floor / tables / orders UI — pick the primary surface; do not invent a second dashboard).
- For **currently active** tables: duration = now − `activated_at` (tenant timezone for display). For **closed** sessions: if history is not stored, either show last activation only when still useful, or add a minimal closed-at / duration log only if product needs past sessions — ask is “was or has been”, so prefer at least live duration + start; history only if a clean existing audit/event path exists.
- Keep tenant scoping; no cross-tenant leaks. i18n any new visible strings.
- Smoke: activate a demo table → UI shows start time and growing duration → close table → duration/end behaviour matches chosen design. Check `docker logs --since 10m pos-front` / back for errors.

## Implementation notes
- No new schema: reuse `Table.activated_at` while `is_active`.
- `GET /tables/with-status` now includes `activated_at`.
- Staff **Tables** tiles/list and floor-plan properties panel show live `TABLES.ACTIVE_SESSION_META` (duration + start in tenant TZ).
- Naive API timestamps are parsed as UTC in `front/src/app/tables/table-active-duration.util.ts`.
- Closed-session history not added (no closed_at / audit path).

## Testing instructions
1. Ensure stack is up (`http://127.0.0.1:4202`).
2. Backend: `docker compose -f docker-compose.yml -f docker-compose.dev.yml exec -T back python3 -m pytest tests/test_tables_with_status_operational.py::TestTablesWithStatusOperational::test_activated_at_exposed_when_table_active -q`
3. Puppeteer: `BASE_URL=http://127.0.0.1:4202 node front/scripts/test-table-active-duration.mjs` (needs `LOGIN_EMAIL` / `LOGIN_PASSWORD` or demo env).
4. Manual: open `/tables`, activate an inactive table → under **Active** see “Active for 0m · since &lt;time&gt;”. Wait ~1 min or trust the 30s UI tick. Close the table → duration line disappears.
5. Optional: `/tables/canvas`, select an active table → properties panel shows the same meta line.
6. Check `docker logs --since 10m pos-front` for compile errors.
