"use client";

import Link from "next/link";
import { LangProvider, useLang } from "@/lib/i18n";

function ErrorInner({ reset }: { reset: () => void }) {
  const { t } = useLang();
  const e = t.errorPage;

  return (
    <div className="min-h-svh flex items-center justify-center px-5 relative">
      <div className="hero-placeholder" />
      <div className="hero-overlay" />
      <div className="relative z-10 w-full max-w-md">
        <div className="card p-8 text-center">
          <Link href="/" className="heading text-lg font-bold tracking-widest block mb-8">
            <span className="gold-text">G</span>RACIANO <span className="gold-text">D</span>HIMA
          </Link>
          <h1 className="heading text-2xl font-bold">{e.title}</h1>
          <p className="text-sm text-muted mt-2 mb-8">{e.desc}</p>
          <div className="flex flex-col gap-3">
            <button onClick={reset} className="btn-gold w-full !justify-center">
              {e.retry}
            </button>
            <Link href="/" className="btn-ghost w-full !justify-center">
              {e.home}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <LangProvider>
      <ErrorInner reset={reset} />
    </LangProvider>
  );
}
