# Graciano Dhima — Site Setup

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

Requires `.env.local` (not committed to git):

```
NEXT_PUBLIC_SUPABASE_URL=https://kwxjvvynzwplodnctrde.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Co0Oo7QPyPAjHE_vJworgQ_nC8kVbSN
```

## Client accounts (Supabase)

- Project: `graciano-site` (ref `kwxjvvynzwplodnctrde`), org "tndreka's", region eu-central-1, free tier.
- Tables: `profiles` (auto-created on signup), `programs` (5 seeded), `purchases` (which client owns which program). RLS enabled — clients only see their own data.
- Pages: `/register`, `/login`, `/dashboard` (protected by middleware). Email/password works out of the box (confirmation email sent by Supabase).

## One-time: enable "Continue with Google"

1. Google Cloud Console → create OAuth client (Web application).
   - Authorized redirect URI: `https://kwxjvvynzwplodnctrde.supabase.co/auth/v1/callback`
2. Supabase Dashboard → Authentication → Sign In / Providers → Google → enable, paste Client ID + Secret.
3. Done — the Google button on /login and /register starts working.

## Before going live on gracianodhima.com

- Supabase Dashboard → Authentication → URL Configuration:
  - Site URL: `https://gracianodhima.com`
  - Redirect URLs: add `https://gracianodhima.com/auth/callback`
- Add the two env vars above to the hosting provider (e.g. Vercel).

## Branded emails (`emails/` folder)

One Graciano Dhima design (black/gold, bilingual EN/AL) in 5 versions:

| File | Scenario | How it's used |
|---|---|---|
| `confirm-signup.html` | Account confirmation | Paste into Supabase → Authentication → Emails → "Confirm signup" |
| `reset-password.html` | Password reset | Paste into Supabase → "Reset password" template |
| `purchase-confirmation.html` | After Stripe payment | Sent by our code in phase 2 (`{{CUSTOMER_NAME}}`, `{{PROGRAM_NAME}}`) |
| `application-received.html` | Coaching application auto-reply | Sent by our code in phase 2 |
| `free-guide.html` | Lead magnet delivery | Sent by our code in phase 2 (`{{GUIDE_URL}}`) |

To apply the two Supabase ones now: Supabase Dashboard → Authentication → Emails → pick template → switch to "Source" and paste the file contents.

Note: emails still *send from* Supabase's generic address until custom SMTP is configured (Resend + DNS records on gracianodhima.com) — do this at deployment time so they send from no-reply@gracianodhima.com.

## Still TODO (phase 2)

- Stripe checkout → insert row into `purchases` after payment
- Real prices, logo, photos, WhatsApp number, testimonials
- Wire lead-magnet + contact forms (API routes / MailerLite)
- Program content inside the dashboard
