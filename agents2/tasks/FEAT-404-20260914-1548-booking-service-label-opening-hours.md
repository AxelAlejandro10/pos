# Editable service labels on booking form (Lunch / dinner) (#404)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/404
- **404**

## Problem / goal
On the public booking form, service text such as **Service: Lunch and dinner** is fixed or not clearly editable. Tenants need custom labels on opening-hours windows (e.g. **Breakfast**) so early slots are not shown as lunch/dinner. From the issue: add a label on opening hours, and let the booking form use that label.

Related docs: `docs/0011-table-reservation-user-guide.md`, `docs/0010-table-reservation-implementation-plan.md`, opening-hours / split lunch–dinner behaviour in `docs/0025-reservation-overbooking-detection.md`.

## High-level instructions for coder
- Find where the booking UI shows **Service: Lunch and dinner** (public `/book/:tenantId` and any staff booking UI that reuses the same copy).
- Add an optional **label** (or equivalent) on opening-hours periods in Settings so staff can name windows (Lunch, Dinner, Breakfast, etc.).
- Persist the label with existing opening-hours JSON/API; keep backward-compatible defaults when the label is empty (current lunch/dinner wording).
- On the booking form, show the label that matches the selected date/time (or the period the guest is booking into). Do not hard-code only Lunch and dinner.
- i18n for new Settings and booking strings in `front/public/i18n/*.json`.
- Smoke: set a custom label in Settings → open `/book/1` → confirm the label appears for matching slots; empty label keeps sensible default; front build clean in `docker logs --since 10m pos-front`.
