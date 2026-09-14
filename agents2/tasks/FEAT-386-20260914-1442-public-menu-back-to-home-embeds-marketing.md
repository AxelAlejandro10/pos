# Public menu "Back to home" embeds Satisfecho site (#386)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/386
- **386**

## Problem / goal
On `/public-menu/{tenantId}` (e.g. `/public-menu/1`), **Back to home** lands users on the embedded Satisfecho marketing site (`/`) instead of a sensible public/tenant home. Same class of bug as staff sidebar Logout (#402) and loyalty root (#373): navigation to `/` shows marketing chrome inside the app shell.

## High-level instructions for coder
- Reproduce on `/public-menu/1`: use **Back to home** and note the destination (screenshot in issue).
- Change the link/route so guests leave the public menu to an appropriate public destination for that tenant (e.g. tenant landing / book / waitlist pattern already used elsewhere) — **not** the marketing `/` embed.
- Align with closed #373 and UNTESTED #402 patterns: avoid `routerLink="/"` / `navigate(['/'])` when that loads the marketing iframe.
- Do not break other public CTAs (menu ↔ book ↔ delivery) unless they share the same bad target.
- Smoke: open `/public-menu/1` → **Back to home** → no embedded marketing site; front build clean in `docker logs --since 10m pos-front`.
