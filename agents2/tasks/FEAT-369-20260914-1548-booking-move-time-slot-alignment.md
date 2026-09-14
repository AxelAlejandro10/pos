# Align Time slot control on public booking form (#369)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/369
- **369**

## Problem / goal
On `/book/` (public booking), the **Time slot** control looks misaligned relative to the left-justified fields above and below it. Move or restyle it so the form reads as one consistent column.

Related: party-size consolidation on #368 (same form; do not fight that layout if both land nearby). Docs: `docs/0011-table-reservation-user-guide.md`.

## High-level instructions for coder
- Open `/book/1` and match the issue screenshot: find the **Time slot** control that sits out of line with neighbouring fields.
- Align horizontal position, label, and spacing with the fields above/below (left edge and typical form rhythm). Prefer CSS/layout fix over new controls.
- Keep slot selection behaviour and availability logic unchanged.
- Check narrow mobile width so the fix does not overflow or wrap oddly.
- Smoke: `/book/1` → Time slot aligns with other fields; booking still submits; front build clean in `docker logs --since 10m pos-front`.
