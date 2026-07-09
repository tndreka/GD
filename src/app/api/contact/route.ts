import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gdEmail, sendEmail, rateLimit, escapeHtml } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`contact:${ip}`)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { name?: string; email?: string; goal?: string; message?: string; lang?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 200);
  const email = (body.email ?? "").trim().slice(0, 200);
  const goal = (body.goal ?? "").trim().slice(0, 200);
  const message = (body.message ?? "").trim().slice(0, 2000);
  const lang = body.lang === "sq" ? "sq" : "en";

  if (!name || !goal || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // 1. Store — the source of truth. If this fails, the request fails.
  const supabase = await createClient();
  const { error: dbError } = await supabase
    .from("contact_submissions")
    .insert({ name, email, goal, message: message || null, lang });
  if (dbError) {
    console.error("contact insert failed:", dbError.message);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  // 2. Notify Graciano — best-effort; a mail failure must not lose the lead.
  const to = process.env.NOTIFY_EMAIL;
  if (to) {
    const html = gdEmail(
      "New Coaching Application",
      `<p><strong style="color:#f5f5f5;">Name:</strong> ${escapeHtml(name)}</p>
       <p><strong style="color:#f5f5f5;">Email:</strong> ${escapeHtml(email)}</p>
       <p><strong style="color:#f5f5f5;">Goal:</strong> ${escapeHtml(goal)}</p>
       <p><strong style="color:#f5f5f5;">Message:</strong><br/>${escapeHtml(message || "—")}</p>
       <p><strong style="color:#f5f5f5;">Language:</strong> ${lang.toUpperCase()}</p>
       <p style="margin-top:20px;">Reply directly to this email to answer them.</p>`
    );
    const sent = await sendEmail({
      to,
      subject: `New application: ${name} — ${goal}`,
      html,
      replyTo: email,
    });
    if (!sent.ok) console.error("contact notify failed:", sent.error);
  }

  return NextResponse.json({ ok: true });
}
