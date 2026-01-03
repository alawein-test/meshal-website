# Pending Integrations TODO

> Last verified: 2025-12-09

## Payment Integration (Stripe)

**Status**: Placeholder added **Location**: `src/pages/Pricing.tsx`

### Steps to implement:

1. Enable Stripe via Lovable's Stripe integration
2. Create products/prices in Stripe Dashboard:
   - Basic Audit: $499 (one-time)
   - Comprehensive Review: $1,499 (one-time)
   - Full Platform Overhaul: $3,999+ (one-time)
3. Add `STRIPE_SECRET_KEY` to project secrets
4. Create checkout session edge function:
   `supabase/functions/create-checkout/index.ts`
5. Add Stripe webhook handler for payment confirmation
6. Update "Get Started" buttons to call checkout API with tier.id

---

## Calendar Integration (Cal.com / Calendly)

**Status**: Placeholder added **Location**: `src/pages/Book.tsx`

### Steps to implement:

#### Option A - Embed (simpler):

1. Create Cal.com or Calendly account
2. Set up event types:
   - Discovery Call (15 min, free)
   - Strategy Session (45 min, $150)
   - Audit Review (60 min, included with tier)
3. Install `@calcom/embed-react` package
4. Add `<Cal calLink="username/event" />` component

#### Option B - API Integration:

1. Add `CALENDLY_API_KEY` or `CAL_API_KEY` to secrets
2. Create edge function to fetch availability
3. Show available slots in the booking form
4. Configure webhook for booking confirmations

---

## Services Implemented

| Service              | Route                     | Status                           |
| -------------------- | ------------------------- | -------------------------------- |
| Services Hub         | `/services`               | ✅ Complete                      |
| Heuristic Evaluation | `/services/heuristic`     | ✅ Complete                      |
| Accessibility Audit  | `/services/accessibility` | ✅ Complete                      |
| User Flow Analysis   | `/services/user-flow`     | ✅ Complete                      |
| Design System Review | `/services/design-review` | ✅ Complete                      |
| Performance Testing  | `/services/performance`   | ✅ Complete                      |
| Security Assessment  | `/services/security`      | ✅ Complete                      |
| Pricing Page         | `/pricing`                | ✅ Complete (Stripe placeholder) |
| Booking Page         | `/book`                   | ⚠️ Needs verification            |

---

## Notes

- All service pages include SEO optimization
- All routes are properly configured in `src/App.tsx`
- ServicesHub links to all 6 service detail pages
- Pricing page links to booking page
- Contact email placeholder: `hello@example.com` (update when ready)

---

## Related Documentation

- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
- [ROUTING.md](./ROUTING.md) - All routes
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
