// Server-only email helper. Sends via the Resend API using the branded
// black/gold template — the same core layout as /emails/*.html, so the
// whole platform's mail is styled from one place.

const GOLD = "#ffc800";
const BG = "#070707";
const SURFACE = "#0e0e0e";
const LINE = "rgba(255,255,255,0.12)";

export function gdEmail(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:${BG};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td align="center" style="padding-bottom:24px;">
          <span style="font-size:22px;font-weight:bold;letter-spacing:4px;color:#f5f5f5;text-transform:uppercase;">
            <span style="color:${GOLD};">G</span>RACIANO <span style="color:${GOLD};">D</span>HIMA
          </span><br/>
          <span style="font-size:10px;letter-spacing:3px;color:${GOLD};text-transform:uppercase;">From Pain To Performance</span>
        </td></tr>
        <tr><td style="background:${SURFACE};border:1px solid ${LINE};border-top:3px solid ${GOLD};padding:32px;">
          <h1 style="margin:0 0 16px;font-size:20px;color:#f5f5f5;text-transform:uppercase;letter-spacing:1px;">${title}</h1>
          <div style="font-size:14px;line-height:1.7;color:#c9c9c9;">${bodyHtml}</div>
        </td></tr>
        <tr><td align="center" style="padding-top:24px;">
          <span style="font-size:11px;color:#9a9a9a;">© ${new Date().getFullYear()} Graciano Dhima · Tirana, Albania</span><br/>
          <a href="https://www.instagram.com/graciano_dhima/" style="font-size:11px;color:${GOLD};text-decoration:none;">Instagram</a>
          <span style="color:#9a9a9a;font-size:11px;"> · </span>
          <a href="https://wa.me/355687683048" style="font-size:11px;color:${GOLD};text-decoration:none;">WhatsApp</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Graciano Dhima <onboarding@resend.dev>",
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 300)}` };
  }
  return { ok: true };
}

// Minimal in-memory rate limiter (per key, e.g. IP). Resets on server restart —
// good enough to stop casual spam until we're behind a real WAF.
const hits = new Map<string, { count: number; ts: number }>();
export function rateLimit(key: string, max = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.ts > windowMs) {
    hits.set(key, { count: 1, ts: now });
    return true;
  }
  if (h.count >= max) return false;
  h.count += 1;
  return true;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
