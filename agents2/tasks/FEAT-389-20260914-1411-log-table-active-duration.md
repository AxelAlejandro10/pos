# Log how long a table was or has been Active (#389)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/389
- **389**

## Problem / goal
Staff need to see **how long** a table has been (or was) **Active**, and **when** that active period started (and ended if closed). Today activation is tracked for ordering (`is_active`, `activated_at` per `docs/0009-table-pin-security.md`), but the UI does not surface a clear duration / timeline for floor ops.

## High-level instructions for coder
- Confirm existing fields/APIs: `Table.activated_at`, `is_active`, close/deactivate paths in `docs/0009-table-pin-security.md` and table status endpoints (`GET /tables/with-status` and related). Prefer **displaying** existing timestamps over new schema unless a closed-session history is missing.
- Show active duration (and start time) where staff already see table status (floor / tables / orders UI — pick the primary surface; do not invent a second dashboard).
- For **currently active** tables: duration = now − `activated_at` (tenant timezone for display). For **closed** sessions: if history is not stored, either show last activation only when still useful, or add a minimal closed-at / duration log only if product needs past sessions — ask is “was or has been”, so prefer at least live duration + start; history only if a clean existing audit/event path exists.
- Keep tenant scoping; no cross-tenant leaks. i18n any new visible strings.
- Smoke: activate a demo table → UI shows start time and growing duration → close table → duration/end behaviour matches chosen design. Check `docker logs --since 10m pos-front` / back for errors.
