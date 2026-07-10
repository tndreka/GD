import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

// Stripe calls this after a successful checkout — grants program access.
// Requires STRIPE_WEBHOOK_SECRET + SUPABASE_SERVICE_ROLE_KEY in env.
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!stripe || !webhookSecret || !serviceKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "no_signature" }, { status: 400 });

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const programId = session.metadata?.program_id;
    if (!userId || !programId) {
      console.error("stripe webhook: missing metadata on session", session.id);
      return NextResponse.json({ error: "missing_metadata" }, { status: 400 });
    }

    const admin = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
    // unique index on stripe_session_id makes retries idempotent
    const { error } = await admin.from("purchases").upsert(
      {
        user_id: userId,
        program_id: programId,
        status: "active",
        stripe_session_id: session.id,
      },
      { onConflict: "stripe_session_id", ignoreDuplicates: true }
    );
    if (error) {
      console.error("stripe webhook: grant failed:", error.message);
      return NextResponse.json({ error: "db" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
