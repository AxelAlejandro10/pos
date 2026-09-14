# Hide Providers NAME/TYPE headers when empty (#398)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/398
- **398**

## Problem / goal
On `/settings` → **Providers**, the empty state still shows column headers **NAME** and **TYPE** with no rows. That makes onboarding look unfinished. Hide those headers until at least one provider exists.

## High-level instructions for coder
- In Settings → Providers, show **NAME** / **TYPE** (and any empty table chrome tied to them) only when the tenant has one or more providers.
- Keep the empty-state CTA (**Add provider** / equivalent) visible and usable when the list is empty.
- After the first provider is added, headers and list layout must appear without a full page reload if the UI already refreshes in place.
- Do not change provider create/edit API contracts; this is UI polish only.
- Smoke: open Settings → Providers with zero providers → no NAME/TYPE headers; add a provider → headers appear. Existing smoke: `npm run test:settings-providers` (see `docs/testing.md`). Check `docker logs --since 10m pos-front`.
