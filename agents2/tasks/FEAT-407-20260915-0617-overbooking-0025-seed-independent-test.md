# Make overbooking 0025 pytest seed-independent (#407)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/407
- **407**

## Problem / goal
`tests/test_overbooking_0025.py::TestOverbooking0025::test_one_empty_table_and_full_slot` fails on a fresh database because it expects demo tables for tenant 1. The test must set up its own tenant/tables (or skip with a clear reason), not depend on `seed_demo_tables`.

See `docs/0025-reservation-overbooking-detection.md` and `docs/0058-test-scenario-one-empty-table.md`. Checker `python -m app.seeds.check_overbooking_0025` already creates and cleans test data — pytest should follow that pattern or equivalent fixtures.

## High-level instructions for coder
- Reproduce in `pos-back`: `python -m pytest tests/test_overbooking_0025.py -q` on a DB without demo tables. Confirm the assertion that hints at `seed_demo_tables`.
- Change the test so it creates the tenant, floors, and tables it needs in setup (mirror other reservation tests or the 0025 checker). Clean up after the test.
- Do not make CI or local pytest require a prior demo seed for this file.
- Keep scenario meaning: one empty table vs full slot vs tenant-level capacity (demo seats in docs: 5×4 + 5×2 = 30 if you keep that shape).
- Leave `check_overbooking_0025` as the seed-aware ops check; pytest is the isolated path.
- Re-run the same pytest module in the back container until it passes without a prior demo seed.
