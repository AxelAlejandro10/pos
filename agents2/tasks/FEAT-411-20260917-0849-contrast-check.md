# Fix top-menu contrast and require contrast checks (#411)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/411
- **411**

## Problem / goal
After recent colour work, the top menu (nav) has poor contrast and is hard to read (screenshot on the issue). Fix the contrast for that chrome. Also update design rules so future UI work always checks contrast ratio, and require testers to fail builds that ship unreadable contrast (open a contrast issue instead of closing as pass).

Related shipped work: #408 / `docs/0028-tenant-public-branding.md` (button tokens `--color-on-primary`, `--color-subtle`). This issue is about **nav / top menu** readability under the new colours, not only primary buttons.

## High-level instructions for coder
1. **Fix contrast:** Reproduce the top menu colours from the issue screenshot (staff or public chrome as shown). Adjust text/icon vs background tokens or component styles so labels stay readable (aim for WCAG AA contrast where practical). Prefer shared CSS variables over one-off patches. Do not break tenant public branding (`docs/0028-tenant-public-branding.md`).
2. **Design rules:** Add a short, mandatory contrast check to the relevant agent/design rules (e.g. `.cursor/rules/` frontend design guidance and/or `docs/0028-tenant-public-branding.md` / testing docs). State that new colours must keep text and icons readable on their backgrounds.
3. **Tester duty:** Update tester instructions (`agents2` tester playbook and/or `docs/testing.md` / relevant agent md) so verification includes a contrast check; on fail, open or reopen a contrast GitHub issue rather than marking the task closed.
4. Smoke: affected top menu readable on light and dark/branded washes used in demo; spot-check primary CTAs still OK after #408; `docker logs --since 10m pos-front` clean.
