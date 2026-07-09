"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LangProvider, useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

function ResetInner() {
  const { t } = useLang();
  const a = t.auth;
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(a.resetMismatch);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(a.errorGeneric);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1500);
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
          <h1 className="heading text-3xl font-bold text-center">{a.resetTitle}</h1>
          <p className="text-sm text-muted text-center mt-2 mb-7">{a.resetSub}</p>

          {done ? (
            <p className="text-sm text-center border border-gold/40 bg-gold/10 px-4 py-4" role="status">
              {a.resetDone}
            </p>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={a.newPassword}
                aria-label={a.newPassword}
                className="bg-surface-2 border border-line px-4 py-3 text-sm outline-none focus:border-gold w-full"
              />
              <input
                required
                type="password"
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={a.confirmPassword}
                aria-label={a.confirmPassword}
                className="bg-surface-2 border border-line px-4 py-3 text-sm outline-none focus:border-gold w-full"
              />
              {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-gold w-full !justify-center disabled:opacity-60">
                {loading ? "…" : a.resetCta}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <LangProvider>
      <ResetInner />
    </LangProvider>
  );
}
