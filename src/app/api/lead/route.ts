import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gdEmail, sendEmail, rateLimit, escapeHtml } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`lead:${ip}`, 10)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { email?: string; lang?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().slice(0, 200);
  const lang = body.lang === "sq" ? "sq" : "en";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error: dbError } = await supabase.from("leads").insert({ email, lang });
  // 23505 = duplicate email — treat as success, they're already on the list
  if (dbError && !dbError.message.includes("duplicate")) {
    console.error("lead insert failed:", dbError.message);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  const to = process.env.NOTIFY_EMAIL;
  if (to && !dbError) {
    const sent = await sendEmail({
      to,
      subject: `New free-guide signup: ${email}`,
      html: gdEmail(
        "New Free-Guide Signup",
        `<p><strong style="color:#f5f5f5;">Email:</strong> ${escapeHtml(email)}</p>
         <p><strong style="color:#f5f5f5;">Language:</strong> ${lang.toUpperCase()}</p>
         <p style="margin-top:20px;">Send them the guide once it's ready — automatic delivery will take over when the guide file exists.</p>`
      ),
    });
    if (!sent.ok) console.error("lead notify failed:", sent.error);
  }

  return NextResponse.json({ ok: true });
}
