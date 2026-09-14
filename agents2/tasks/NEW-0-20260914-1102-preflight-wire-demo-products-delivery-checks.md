# Wire demo products + delivery checks into 008 preflight

## GitHub Issues
- **Issue:** (none — enhancement reviewer)
- **0**

## Problem / goal

**008** preflight already soft-runs `check_demo_tables` and `check_demo_waiting_list`, but not the other tenant-1 seed checks documented in **AGENTS.md**: `check_demo_products`, `check_demo_delivery_orders`, and `check_demo_delivery_settings`. Demo can lose products or Satisfecho Delivery samples without waking **008** (`G008_DEMO_SIGNALS`). Checks already exist and pass on a healthy stack; they only need soft SIGNAL wiring (same pattern as waiting list).

## Evidence (008 preflight / review)

- Digest 2026-09-14 weekly sweep: demo section lists tables + waiting list only; `demo_tables_check=ok`, `demo_waiting_list_check=ok`
- Modules present: `back/app/seeds/check_demo_products.py`, `check_demo_delivery_orders.py`, `check_demo_delivery_settings.py`
- Local verify (this run): all three exit **0** on tenant 1
- Precedent: `CLOSED-0-20260723-2027-check-demo-waiting-list-entries` wired waiting list into `scripts/enhancement-reviewer-preflight.sh`; delivery-orders task documented the check but did **not** wire preflight
- No open root task owns this wiring (dedupe grep)

## High-level instructions for coder

- In **`scripts/enhancement-reviewer-preflight.sh`**, after the existing demo soft checks, run (when back is up; skip/inform when down — do not fail the script hard):
  - `python -m app.seeds.check_demo_products`
  - `python -m app.seeds.check_demo_delivery_orders`
  - `python -m app.seeds.check_demo_delivery_settings`
- Emit `demo_products_check=ok|fail|skipped`, `demo_delivery_orders_check=…`, `demo_delivery_settings_check=…`
- On unowned **fail**, emit `SIGNAL demo_*_check=fail` and bump `G008_DEMO_SIGNALS` (mirror tables/waiting-list ownership skip if a repair task already exists)
- Keep digest Summary counters consistent (`G008_SIGNALS` includes demo)
- Optional one-line note in **`docs/agent-loop.md`** or **`docs/testing.md`** that 008 watches these three — no AGENTS.md rewrite beyond a short cross-link if needed
- Pass/fail: readonly preflight shows the three status lines; forced fail (or mocked) yields SIGNAL + demo counter bump; healthy stack stays `G008_DEMO_SIGNALS=0` for these
