# Hyperlink sidebar POS brand to `/dashboard` (#390)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/390
- **390**

## Problem / goal
The **POS** label at the top of the staff sidebar should navigate to **`/dashboard`** when clicked or tapped. Users expect the brand/title control to return them to the main dashboard.

## High-level instructions for coder
- Find the sidebar header / brand markup that shows **POS** (and any version line beneath it). Make the **POS** title a link or router navigation to `/dashboard`.
- Keep keyboard and screen-reader affordances clear (link or button with an accessible name).
- Do not break related sidebar work already in flight (version → changelog #399, logout placement #402/#383, language control #384). Coordinate only if you touch the same header markup; do not expand scope into those issues.
- Smoke: log in → click **POS** in the sidebar → land on `/dashboard`. Check `docker logs --since 10m pos-front`.
- Prefer existing Angular `routerLink` patterns used elsewhere in the shell.
