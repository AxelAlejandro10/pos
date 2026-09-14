# Update ROADMAP for Aug–Sep 2026 shipped work

## GitHub Issues
- **Issue:** (none — enhancement reviewer)
- **0**

## Problem / goal

Root **`ROADMAP.md`** still frames shipped work as “through **2026-07-31**”. Many user-visible slices landed in **Aug–Sep 2026** (CHANGELOG **2.1.153–2.1.161** and closed tasks). Contributors reading ROADMAP miss shared QR cart, session-scoped order history, `/features`, user manual, stock alerts, platform login counts, pricing QR Menu tier, and floating delivery/QR CTA. The file’s own weekly checklist asks for this refresh; last substantive roadmap pass was **#341** (2026-08-01).

## Evidence (008 preflight / review)

- Digest 2026-09-14: `weekly_due=yes` (16 days since last 008 review); `G008_NEW_BACKLOG_PAUSE=0`; NEW=0 FEAT=4; demo checks ok; no `PAUSE new_backlog`
- `ROADMAP.md` mtime ~2026-08-09; Shipped intro still says through 2026-07-31
- `rg` on ROADMAP misses Aug keywords: shared cart / order history / stock alert / manual-usuario / login count / QR Menu free
- Evidence in CHANGELOG: **2.1.153–2.1.161**; closed tasks e.g. CLOSED-347…358, #349, #350, #360
- Do **not** duplicate open FEAT-360 / 373 / 376 / 377 (product bugs/features — not roadmap text)

## High-level instructions for coder

- Skim **`CHANGELOG.md`** from **2.1.153** through newest and recent **`agents2/tasks/done/2026/08/`** + **`09/`** CLOSED tasks
- Update **`ROADMAP.md`** Shipped (and In progress / Deferred only when evidence is clear): bump the “through …” date; add short rows/bullets with doc links for at least:
  - Public `/features` landings (#347 / #348)
  - Shared dine-in QR draft cart (#349) + session/customer order history (#350) — point at `docs/0008` / `docs/0009`
  - User manual `/manual-usuario` (#353 / #354)
  - README starter paths (#355) only if ROADMAP should mention onboarding docs
  - Platform owner/staff login counts (#315 / 2.1.156)
  - Product stock alerts (#356) + tenant ID in header (#357)
  - Public pricing QR Menu free / support tier (#358)
  - Floating order total + CTA (#360) under Delivery / guest ordering
- Align **`docs/0032-github-issues-roadmap.md`** only where a #52–#54 status contradicts shipped MVPs (do not invent umbrella status)
- Keep the weekly checklist; no bulk `docs/` rewrite; no product code
- Pass/fail: ROADMAP no longer claims shipped surface stops at 2026-07-31; `rg` hits the new Aug–Sep themes; CHANGELOG/closed-task evidence only
