# Hide Providers NAME/TYPE headers when empty (#398)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/398
- **398**

## Status
- **Implemented:** 2026-09-14T12:22:15Z
- Providers table (NAME/TYPE headers + rows) renders only when `providers().length > 0`.
- Add provider CTA stays visible when the list is empty.
- After create, `loadProviders()` refreshes the signal so the table appears without a full page reload.

## Problem / goal
On `/settings` → **Providers**, the empty state still shows column headers **NAME** and **TYPE** with no rows. That makes onboarding look unfinished. Hide those headers until at least one provider exists.

## High-level instructions for coder
- In Settings → Providers, show **NAME** / **TYPE** (and any empty table chrome tied to them) only when the tenant has one or more providers.
- Keep the empty-state CTA (**Add provider** / equivalent) visible and usable when the list is empty.
- After the first provider is added, headers and list layout must appear without a full page reload if the UI already refreshes in place.
- Do not change provider create/edit API contracts; this is UI polish only.
- Smoke: open Settings → Providers with zero providers → no NAME/TYPE headers; add a provider → headers appear. Existing smoke: `npm run test:settings-providers` (see `docs/testing.md`). Check `docker logs --since 10m pos-front`.

## Testing instructions
1. Ensure the stack is up (`http://127.0.0.1:4202`).
2. Run: `BASE_URL=http://127.0.0.1:4202 HEADLESS=1 npm run test:settings-providers --prefix front`
   - Expect pass. With tenant providers present: section + Add button + `settings-providers-table` with Name/Type headers.
3. Empty-state check (manual or intercept GET `/api/providers` → `[]`):
   - Open Settings → Providers with zero providers.
   - Confirm Add provider is visible.
   - Confirm no NAME/TYPE headers and no `settings-providers-table`.
4. Add a provider via the modal; confirm the table and headers appear without a full page reload.
5. Confirm `docker logs --since 10m pos-front` has no new Angular compile errors.
