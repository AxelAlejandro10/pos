# Add way to delete Loyalty Club members

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/362
- **362**

## Problem / goal
Staff can manage **Loyalty Club** members in Settings, but there is no way to **delete** a member. Operators need a safe remove path for wrong or obsolete memberships.

## High-level instructions for coder
- Find Loyalty Club member list/management in Settings (and any related API).
- Add a delete (or remove) action per member with confirmation so deletes are intentional.
- Scope by tenant; enforce existing auth roles consistent with other loyalty admin actions.
- Soft-delete vs hard-delete: follow existing loyalty/customer patterns; prefer the safer option already used nearby if one exists.
- Update API + UI; keep public loyalty card flows working for remaining members.
- Smoke: Settings → Loyalty Club → delete a member → member gone from list; unauthorized users cannot delete; front build clean in `docker logs --since 10m pos-front`.
