"use client";

/* Cookie-consent banner + analytics loader.
 * GA4 and Meta Pixel load ONLY after the visitor accepts, and only if the
 * env IDs are set (NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_META_PIXEL_ID).
 * Consent choice persists in localStorage ("gd-consent").
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LangProvider, useLang } from "@/lib/i18n";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Consent = "granted" | "denied" | null;

/* eslint-disable @typescript-eslint/no-explicit-any, prefer-rest-params */
function loadGa(id: string) {
  if ((window as any).gtag) return;
  const s = document.createElement("script");
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  s.async = true;
  document.head.appendChild(s);
  (window as any).dataLayer = (window as any).dataLayer || [];
  const gtag = function () {
    (window as any).dataLayer.push(arguments);
  };
  (window as any).gtag = gtag;
  (gtag as any)("js", new Date());
  (gtag as any)("config", id, { anonymize_ip: true });
}

function loadPixel(id: string) {
  if ((window as any).fbq) return;
  const n: any = function () {
    if (n.callMethod) {
      // eslint-disable-next-line prefer-spread
      n.callMethod.apply(n, arguments);
    } else {
      n.queue.push(arguments);
    }
  };
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  (window as any).fbq = n;
  (window as any)._fbq = n;
  const s = document.createElement("script");
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  s.async = true;
  document.head.appendChild(s);
  n("init", id);
  n("track", "PageView");
}
/* eslint-enable @typescript-eslint/no-explicit-any, prefer-rest-params */

function activate() {
  if (GA_ID) loadGa(GA_ID);
  if (PIXEL_ID) loadPixel(PIXEL_ID);
}

function BannerInner({ onChoice }: { onChoice: (c: Consent) => void }) {
  const { t } = useLang();
  const c = t.cookie;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <div className="card max-w-2xl mx-auto p-5 flex flex-col sm:flex-row items-center gap-4 border border-line">
        <p className="text-xs text-muted flex-1">
          {c.msg}{" "}
          <Link href="/privacy" className="text-gold hover:underline">
            {c.more}
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onChoice("denied")}
            className="btn-ghost !justify-center text-xs px-4 py-2"
          >
            {c.decline}
          </button>
          <button
            onClick={() => onChoice("granted")}
            className="btn-gold !justify-center text-xs px-4 py-2"
          >
            {c.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false); // avoid banner flash during hydration
  const pathname = usePathname();
  const firstPage = useRef(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("gd-consent");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "granted" || saved === "denied") setConsent(saved);
    setReady(true);
    if (saved === "granted") activate();
  }, []);

  // track client-side route changes (initial page is tracked on load)
  useEffect(() => {
    if (firstPage.current) {
      firstPage.current = false;
      return;
    }
    if (consent !== "granted") return;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (window as any).gtag?.("event", "page_view", { page_path: pathname });
    (window as any).fbq?.("track", "PageView");
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }, [pathname, consent]);

  function onChoice(c: Consent) {
    if (!c) return;
    try {
      window.localStorage.setItem("gd-consent", c);
    } catch {}
    setConsent(c);
    if (c === "granted") activate();
  }

  // nothing to consent to if no analytics IDs are configured
  if (!GA_ID && !PIXEL_ID) return null;
  if (!ready || consent) return null;

  return (
    <LangProvider>
      <BannerInner onChoice={onChoice} />
    </LangProvider>
  );
}
