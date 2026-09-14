# Consolidate Party size labels on `/book/`

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/368
- **368**

## Problem / goal
On the public booking form (`/book/`), **Party size** appears twice with nearly the same wording (`Party size:` and `Party size`). That is redundant and confusing. Screenshots in the issue show both labels in the guest-count UI.

## High-level instructions for coder
- Open `/book/{tenantId}` (e.g. `/book/1`) and find both **Party size** labels in the party-size control.
- Keep **one** clear label (or accessible name) for the control. Remove the duplicate visible text.
- Check i18n keys for both strings; reuse one key or drop the unused key if nothing else references it.
- Keep behaviour the same (guest count still works; validation and submit unchanged).
- Smoke: `/book/1` shows a single party-size label; front build clean in `docker logs --since 10m pos-front`.
