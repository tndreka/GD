import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  let body: { slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const slug = (body.slug ?? "").trim();
  if (!slug) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { data: program } = await supabase
    .from("programs")
    .select("id, slug, title_en, price_cents, currency")
    .eq("slug", slug)
    .eq("active", true)
    .single();
  if (!program || program.price_cents <= 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // already owns it?
  const { data: owned } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("program_id", program.id)
    .eq("status", "active")
    .limit(1);
  if (owned?.length) return NextResponse.json({ error: "already_owned" }, { status: 409 });

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const origin = new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    client_reference_id: user.id,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: program.currency,
          unit_amount: program.price_cents,
          product_data: { name: program.title_en },
        },
      },
    ],
    metadata: { user_id: user.id, program_id: program.id },
    success_url: `${origin}/dashboard?purchase=success`,
    cancel_url: `${origin}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
