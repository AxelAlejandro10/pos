# Add way to delete Loyalty Club members

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/362
- **362**

## Status
- **In progress → implementation done** (agent 010)
- Hard delete via `DELETE /loyalty/memberships/{id}` (`loyalty:write`); Settings UI Delete + confirm

## Problem / goal
Staff can manage **Loyalty Club** members in Settings, but there is no way to **delete** a member. Operators need a safe remove path for wrong or obsolete memberships.

## High-level instructions for coder
- Find Loyalty Club member list/management in Settings (and any related API).
- Add a delete (or remove) action per member with confirmation so deletes are intentional.
- Scope by tenant; enforce existing auth roles consistent with other loyalty admin actions.
- Soft-delete vs hard-delete: follow existing loyalty/customer patterns; prefer the safer option already used nearby if one exists.
- Update API + UI; keep public loyalty card flows working for remaining members.
- Smoke: Settings → Loyalty Club → delete a member → member gone from list; unauthorized users cannot delete; front build clean in `docker logs --since 10m pos-front`.

## Implementation notes
- No soft-delete column on `loyalty_membership`; hard delete matches FK design (ledger/devices CASCADE; order + referred_by SET NULL) and billing-customer delete pattern.
- Auth: same as adjust — `Permission.LOYALTY_WRITE` (owner/admin). Waiter / other tenant rejected.
- UI: Actions column + confirm (`SETTINGS.LOYALTY_CONFIRM_DELETE_MEMBER`); `data-testid=loyalty-delete-member`.
- Docs: `docs/0066-club-loyalty.md`; version **2.1.174**.

## Testing instructions

1. Log in as owner/admin → **Settings → Loyalty club**. Ensure the program is enabled and at least one member exists (join via `/loyalty/1` if needed).
2. In the members table, click **Delete** on a member. Confirm the dialog. Member disappears from the list (`data-testid=loyalty-delete-member`).
3. Open that member’s former card URL `/loyalty/card/{token}` → expect not found / unavailable (404).
4. As waiter (or user without `loyalty:write`), confirm Delete is not usable via API (`DELETE /loyalty/memberships/{id}` → 401/403). Other-tenant admin → 404.
5. Backend: `docker compose exec back python3 -m pytest tests/test_club_loyalty.py::TestClubLoyalty::test_staff_delete_membership -q` → PASS.
6. Front: `docker logs --since 10m pos-front` — no TS/NG errors for loyalty-settings; bundle complete. Optional: `BASE_URL=http://127.0.0.1:4202 npm run test:landing-version --prefix front`.

Coder smoke: pytest delete membership PASS (full club loyalty 11 passed); landing-version PASS; front bundle complete after loyalty-settings edit.
