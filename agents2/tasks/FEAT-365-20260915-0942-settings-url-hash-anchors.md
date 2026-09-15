# Add `#` anchors to URL in `/settings`

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/365
- **365**

## Problem / goal
Staff on `/settings` need deep links such as `/settings#openinghours` so they can jump to a section and so docs can point at exact settings areas. Today the settings vertical nav switches sections in-page without updating the URL hash (or reading it on load).

## High-level instructions for coder
- Inspect `/settings` layout (`settings.component` + `settings-nav` / section tabs). Map each nav target to a stable hash slug (e.g. `openinghours`, `payments`, `loyalty`). Prefer kebab or lowercase ids that match docs-friendly names.
- On section change (nav click / tab), update the location hash without a full reload (`Location` / `Router` fragment or equivalent). Preserve query params if any.
- On load (and on `hashchange`), if a known fragment is present, activate that section and scroll it into view.
- Unknown hashes: ignore safely; stay on default section.
- Do not break existing `data-testid` settings nav smoke; keep multi-tenant scoping untouched (settings stay tenant-scoped as today).
- Optional: document a few example anchors in a short note if a settings doc already lists sections.
- Smoke: open `/settings#…` for at least two sections; refresh keeps the section; nav clicks update the hash; `docker logs --since 10m pos-front` shows a clean bundle.
