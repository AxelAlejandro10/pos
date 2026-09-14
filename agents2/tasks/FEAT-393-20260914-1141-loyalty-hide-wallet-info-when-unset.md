# Hide Wallet setup text on public loyalty when not configured (#393)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/393
- **393**

## Problem / goal
On `/loyalty/{tenantId}` (e.g. `/loyalty/1`), guests see Wallet-setup guidance meant for operators (PassKit / Google Wallet issuer notes). Normal guests should not see that. Prefer also hiding “Save this card link…” style Wallet CTAs when Wallet issuance is not available.

See `docs/0066-club-loyalty.md` (Wallet / PassKit section).

## High-level instructions for coder
- Inspect the public loyalty page (`/loyalty/{tenantId}`) and any Wallet status API (`…/wallet` availability flags, `wallet_passes_enabled`, env/cert readiness).
- Hide operator-only Wallet certificate / issuer setup copy from guest views. Staff Settings may keep it if already there.
- When Apple/Google Wallet is not available for the tenant, hide Wallet save / add-to-wallet actions (and related “save this card link” copy if it only applies to Wallet).
- Keep join + balance card working without Wallet certs (existing fallback).
- Do not paste secrets or raw env into UI or commits.
- i18n for any new guest-visible strings; smoke `/loyalty/1` with and without Wallet configured if feasible; check `docker logs --since 10m pos-front` after edits.
