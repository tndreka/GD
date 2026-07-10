import Stripe from "stripe";

// Test mode until launch — set STRIPE_SECRET_KEY (sk_test_...) in .env.local.
// Returns null when not configured so routes can fail gracefully.
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}
