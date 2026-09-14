# Fix delivery floating CTA overlapping the cart (#360)

## GitHub Issues
- **Issue:** https://github.com/satisfecho/pos/issues/360
- **360**

## Problem / goal
The always-visible order total + next-step CTA from **2.1.161** works on the delivery **menu** step, but on the **cart** (and possibly **address**) step the fixed bottom bar sits **on top of** the cart list / inline actions. That looks broken. Reporter (raro42): *“the button is floating on top of the cart. That looks really bad. Must fix this.”*

Keep the always-visible total + continue prompt where it helps (especially long **menu** scroll). Do **not** cover cart lines or primary buttons.

## High-level instructions for coder
- Inspect `front/src/app/delivery/delivery-checkout.component.{html,scss,ts}` and the QR menu cart sheet if the same overlap exists there.
- Fix layout so the floating bar never covers cart content or CTAs (options: hide bar on cart/address when inline actions are present; add enough bottom padding; integrate total+CTA into one bottom sheet like QR menu instead of stacking two bars).
- Prefer one clear bottom chrome pattern — avoid duplicate primary buttons stacked on each other.
- Update `front/scripts/test-delivery-checkout.mjs` if selectors or step behaviour change; keep coverage that menu still has a fixed continue CTA without scrolling.
- Verify on mobile-width viewport (≈390×844) and desktop; check `docker logs` for front build errors after edits.
- Smoke: `BASE_URL=http://127.0.0.1:4202 TENANT_ID=1 node front/scripts/test-delivery-checkout.mjs` (and prod after promote if required by tester).

## Acceptance criteria
- [ ] On delivery **menu** with items in cart: fixed/visible total + next-step CTA without scrolling to top.
- [ ] On delivery **cart** (and address if bar is shown): cart lines and continue/back actions are fully visible; no floating button covering content.
- [ ] QR `/menu/:token` cart sheet still usable if touched; no regression of Checkout / place order.
- [ ] Delivery Puppeteer smoke passes.
