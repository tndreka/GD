"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { LangProvider, useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

function ForgotInner() {
  const { t } = useLang();
  const a = t.auth;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(a.errorGeneric);
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-svh flex items-center justify-center px-5 relative">
      <div className="hero-placeholder" />
      <div className="hero-overlay" />
      <div className="relative z-10 w-full max-w-md">
        <div className="card p-8">
          <Link href="/" className="heading text-lg font-bold tracking-widest block text-center mb-6">
            <span className="gold-text">G</span>RACIANO <span className="gold-text">D</span>HIMA
          </Link>
          <h1 className="heading text-3xl font-bold text-center">{a.forgotTitle}</h1>
          <p className="text-sm text-muted text-center mt-2 mb-7">{a.forgotSub}</p>

          {sent ? (
            <p className="text-sm text-center border border-gold/40 bg-gold/10 px-4 py-4" role="status">
              {a.resetSent}
            </p>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={a.email}
                aria-label={a.email}
                className="bg-surface-2 border border-line px-4 py-3 text-sm outline-none focus:border-gold w-full"
              />
              {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-gold w-full !justify-center disabled:opacity-60">
                {loading ? "…" : a.sendReset}
              </button>
            </form>
          )}

          <p className="text-xs text-muted text-center mt-6">
            <Link href="/login" className="text-gold hover:underline">
              {a.toLogin}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <LangProvider>
      <ForgotInner />
    </LangProvider>
  );
}
