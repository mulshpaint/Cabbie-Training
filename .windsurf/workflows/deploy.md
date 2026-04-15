---
description: How to deploy cabbie-training to Vercel
---

## Deploy to Vercel (Production)

### Prerequisites
- Vercel CLI installed (`pnpm dlx vercel`)
- Project already linked (`.vercel/project.json` exists)

### Steps

1. Make sure the build passes locally:
// turbo
```bash
pnpm build
```

2. Deploy to Vercel production:
```bash
pnpm dlx vercel --prod
```

3. After deploy, verify the live site:
   - Homepage loads correctly
   - `/privacy-policy` page renders
   - `/cookie-policy` page renders
   - Cookie consent banner appears on first visit
   - Booking form shows privacy consent checkbox
   - Contact form shows privacy consent checkbox
   - Footer has Privacy Policy and Cookie Policy links

### Environment Variables
Make sure these are set in the Vercel dashboard (Settings → Environment Variables):
- `MONGODB_URI`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `BREVO_API_KEY`
- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_PLACE_ID`
- `NEXT_PUBLIC_BASE_URL` (set to your production URL, e.g. `https://cabbietraining.co.uk`)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (set to your production URL)
