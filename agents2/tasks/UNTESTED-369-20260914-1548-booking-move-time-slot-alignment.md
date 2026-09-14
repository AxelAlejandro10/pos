# Align Time slot control on public booking form (#369)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/369
- **369**

## Status
- **Implementation:** Done (2026-09-14T15:55:00Z). CSS-only: week summary stacks Date then Time slot left-aligned; removed ≥480px `space-between` row that pushed Time slot to the right.

## Problem / goal
On `/book/` (public booking), the **Time slot** control looks misaligned relative to the left-justified fields above and below it. Move or restyle it so the form reads as one consistent column.

Related: party-size consolidation on #368 (same form; do not fight that layout if both land nearby). Docs: `docs/0011-table-reservation-user-guide.md`.

## High-level instructions for coder
- Open `/book/1` and match the issue screenshot: find the **Time slot** control that sits out of line with neighbouring fields.
- Align horizontal position, label, and spacing with the fields above/below (left edge and typical form rhythm). Prefer CSS/layout fix over new controls.
- Keep slot selection behaviour and availability logic unchanged.
- Check narrow mobile width so the fix does not overflow or wrap oddly.
- Smoke: `/book/1` → Time slot aligns with other fields; booking still submits; front build clean in `docker logs --since 10m pos-front`.

## What changed
- `front/src/app/shared/reservation-week-slot-grid.component.scss`: `.book-week-summary-main` stays column layout; Time slot control left-aligned with Party size / Service / Date; select capped at `12rem` width.

## Testing instructions
1. Open `http://127.0.0.1:4202/book/1` (or production equivalent).
2. Select an available day in the month grid so the summary shows Date + Time slot.
3. Confirm **Time slot** label and select share the same left edge as Party size / Service / Date (not pushed to the right on desktop widths ≥480px).
4. Change party size / service; pick another time; confirm slot behaviour is unchanged.
5. Resize to a narrow mobile width; confirm the select does not overflow the summary card.
6. Optional smoke: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`.
7. Front build: `docker logs --since 10m pos-front` — no `Application bundle generation failed` / TS errors for this change.
