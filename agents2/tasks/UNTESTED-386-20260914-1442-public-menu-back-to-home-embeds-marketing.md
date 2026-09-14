# Public menu "Back to home" embeds Satisfecho site (#386)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/386
- **386**

## Status
- **Implemented:** 2026-09-14T15:02:00Z
- Public menu (and delivery) **Back to home** now go to `/book/{tenantId}` instead of marketing `/`.

## Problem / goal
On `/public-menu/{tenantId}` (e.g. `/public-menu/1`), **Back to home** lands users on the embedded Satisfecho marketing site (`/`) instead of a sensible public/tenant home. Same class of bug as staff sidebar Logout (#402) and loyalty root (#373): navigation to `/` shows marketing chrome inside the app shell.

## High-level instructions for coder
- Reproduce on `/public-menu/1`: use **Back to home** and note the destination (screenshot in issue).
- Change the link/route so guests leave the public menu to an appropriate public destination for that tenant (e.g. tenant landing / book / waitlist pattern already used elsewhere) — **not** the marketing `/` embed.
- Align with closed #373 and UNTESTED #402 patterns: avoid `routerLink="/"` / `navigate(['/'])` when that loads the marketing iframe.
- Do not break other public CTAs (menu ↔ book ↔ delivery) unless they share the same bad target.
- Smoke: open `/public-menu/1` → **Back to home** → no embedded marketing site; front build clean in `docker logs --since 10m pos-front`.

## What changed
- `public-menu.component.html`: footer and error **Back to home** → `[routerLink]="['/book', tenantId()]"` (`data-testid="public-menu-back-home"`). Invalid tenant (`tenantId` 0) → `/features` (not `/`).
- `delivery-checkout.component.html`: same bad `/` target fixed to `/book/{tenantId}` (`data-testid="delivery-back-home"`).
- Menu ↔ book ↔ delivery nav links unchanged.

## Testing instructions

1. App up on `http://127.0.0.1:4202`.
2. Open `/public-menu/1`. Click footer **Back to home** (`[data-testid="public-menu-back-home"]`).
3. Expect URL `/book/1` with the book-a-table form. Must **not** land on `/` or show `app-landing` marketing chrome.
4. Confirm `docker logs --since 10m pos-front` has no new TS/Angular compile errors.
5. Optional: `BASE_URL=http://127.0.0.1:4202 node tmp/smoke-public-menu-back-home.mjs`
6. Optional: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`
7. Coder verified: smoke PASS (href `/book/1`, no `app-landing`); landing smoke PASS; front rebuild complete without TS errors.
