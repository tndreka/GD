"use client";

import Link from "next/link";
import { LangProvider, useLang } from "@/lib/i18n";

function NotFoundInner() {
  const { t } = useLang();
  const n = t.notFound;

  return (
    <div className="min-h-svh flex items-center justify-center px-5 relative">
      <div className="hero-placeholder" />
      <div className="hero-overlay" />
      <div className="relative z-10 w-full max-w-md">
        <div className="card p-8 text-center">
          <Link href="/" className="heading text-lg font-bold tracking-widest block mb-8">
            <span className="gold-text">G</span>RACIANO <span className="gold-text">D</span>HIMA
          </Link>
          <p className="heading text-7xl font-bold gold-text">404</p>
          <h1 className="heading text-2xl font-bold mt-4">{n.title}</h1>
          <p className="text-sm text-muted mt-2 mb-8">{n.desc}</p>
          <Link href="/" className="btn-gold !justify-center inline-flex">
            {n.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <LangProvider>
      <NotFoundInner />
    </LangProvider>
  );
}
