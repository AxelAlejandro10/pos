# Fix top-menu contrast and require contrast checks (#411)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/411
- **411**

## Status
**WIP → UNTESTED** (feature coder 010, 2026-09-17T08:56:00Z)

## Problem / goal
After recent colour work, the top menu (nav) has poor contrast and is hard to read (screenshot on the issue). Fix the contrast for that chrome. Also update design rules so future UI work always checks contrast ratio, and require testers to fail builds that ship unreadable contrast (open a contrast issue instead of closing as pass).

Related shipped work: #408 / `docs/0028-tenant-public-branding.md` (button tokens `--color-on-primary`, `--color-subtle`). This issue is about **nav / top menu** readability under the new colours, not only primary buttons.

## High-level instructions for coder
1. **Fix contrast:** Reproduce the top menu colours from the issue screenshot (staff or public chrome as shown). Adjust text/icon vs background tokens or component styles so labels stay readable (aim for WCAG AA contrast where practical). Prefer shared CSS variables over one-off patches. Do not break tenant public branding (`docs/0028-tenant-public-branding.md`).
2. **Design rules:** Add a short, mandatory contrast check to the relevant agent/design rules (e.g. `.cursor/rules/` frontend design guidance and/or `docs/0028-tenant-public-branding.md` / testing docs). State that new colours must keep text and icons readable on their backgrounds.
3. **Tester duty:** Update tester instructions (`agents2` tester playbook and/or `docs/testing.md` / relevant agent md) so verification includes a contrast check; on fail, open or reopen a contrast GitHub issue rather than marking the task closed.
4. Smoke: affected top menu readable on light and dark/branded washes used in demo; spot-check primary CTAs still OK after #408; `docker logs --since 10m pos-front` clean.

## What was done
- Root cause: sticky `app-public-guest-header` used white text on `--hero-header-bg` (tenant `public_background_color`). Light washes (e.g. lime in the issue screenshot) failed contrast.
- Added `pickContrastingForeground` / luminance helpers in `front/src/app/shared/public-brand-colors.ts`.
- Header sets `--hero-header-fg` from wash luminance; parents pass `[headerBackgroundColor]`.
- Rules/docs: `.cursor/rules/ui-contrast.mdc`, `docs/0028-tenant-public-branding.md`, `docs/agent-cursor-rules.md`, `docs/testing.md`, `agents2/020-test.md`.
- Smoke `test:public-guest-header` now asserts ≥4.5:1 contrast on the sticky header.

## Testing instructions

**Start time (UTC):** record when tester begins.

**Environment:** `docker compose -f docker-compose.yml -f docker-compose.dev.yml`, `BASE_URL=http://127.0.0.1:4202`, branch `development`.

### What to verify

1. **Sticky guest nav contrast (dark wash):** Open `/book/1` (tenant 1 demo often uses a dark public background). Confirm brand name + Menu/Book/Waitlist/… labels are clearly readable on the sticky bar. `data-testid="public-guest-header"` must show readable ink (not washed-out white on light green).
2. **Light wash path:** In Settings → Business profile (or API), set public background to a light colour (e.g. `#D4E157` / similar to the issue screenshot), reload `/book/1`, confirm nav uses **dark** ink and stays readable. Restore prior colour after the check if you changed demo data.
3. **Smoke script:** `BASE_URL=http://127.0.0.1:4202 HEADLESS=1 npm run test:public-guest-header --prefix front` — must PASS (includes contrast ≥4.5:1).
4. **Primary CTAs still OK (#408):** On `/book/1`, primary Book / submit controls keep white text on primary fill.
5. **Front logs:** `docker logs --since 10m pos-front` — no TypeScript/Angular compile errors.
6. **Contrast duty (meta):** Confirm `agents2/020-test.md` and `docs/testing.md` require failing unreadable contrast (open/reopen contrast issue, no CLOSED pass).

### On contrast FAIL
Do **not** close as PASS. Open or reopen a contrast GitHub issue (or comment on #411), rename task **TESTING → WIP**, cite evidence in the Test report.

### URLs
- `http://127.0.0.1:4202/book/1`
- optionally `/public-menu/1`, `/waitlist/1` for the same sticky header
