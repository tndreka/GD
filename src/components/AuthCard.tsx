"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

export default function AuthCard({ mode }: { mode: "login" | "register" }) {
  const { lang, setLang, t } = useLang();
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [exists, setExists] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const a = t.auth;
  const isLogin = mode === "login";

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function resendEmail() {
    if (cooldown > 0 || !email) return;
    setError(null);
    setResent(false);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(a.errorGeneric);
      return;
    }
    setResent(true);
    setCooldown(60); // Supabase rate-limits resends anyway
  }

  const resendBlock = (
    <div className="mt-4 text-center">
      {resent && <p className="text-xs text-gold mb-2">{a.resent}</p>}
      <button
        type="button"
        onClick={resendEmail}
        disabled={cooldown > 0}
        className="text-xs text-muted hover:text-gold transition-colors underline disabled:no-underline disabled:opacity-60"
      >
        {cooldown > 0 ? `${a.resendIn} ${cooldown}s` : a.resend}
      </button>
    </div>
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        if (error.message.toLowerCase().includes("not confirmed")) {
          setError(a.errorUnconfirmed);
          setShowResend(true);
        } else {
          setError(error.message.includes("Invalid") ? a.errorInvalid : a.errorGeneric);
        }
        return;
      }
      setShowResend(false);
      router.push("/dashboard");
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      setLoading(false);
      if (error) {
        setError(error.message.toLowerCase().includes("already registered") ? a.errorExists : a.errorGeneric);
        setExists(error.message.toLowerCase().includes("already registered"));
        return;
      }
      // Supabase fakes success for existing accounts (anti-enumeration) but
      // returns an empty identities array — surface it honestly instead.
      if (data.user && data.user.identities?.length === 0) {
        setError(a.errorExists);
        setExists(true);
        return;
      }
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setCheckEmail(true);
      }
    }
  }

  async function withGoogle() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(a.errorGeneric);
  }

  const inputCls =
    "bg-surface-2 border border-line px-4 py-3 text-sm outline-none focus:border-gold w-full";

  return (
    <div className="min-h-svh flex items-center justify-center px-5 relative">
      <div className="hero-placeholder" />
      <div className="hero-overlay" />

      <div className="relative z-10 w-full max-w-md">
        {/* top bar: back link + language toggle */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-xs text-muted hover:text-foreground transition-colors">
            {a.back}
          </Link>
          <div className="flex text-xs font-bold border border-line overflow-hidden">
            {(["en", "sq"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1.5 uppercase transition-colors ${
                  lang === l ? "bg-gold text-black" : "text-muted hover:text-foreground"
                }`}
              >
                {l === "sq" ? "AL" : "EN"}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-8">
          <Link href="/" className="heading text-lg font-bold tracking-widest block text-center mb-6">
            <span className="gold-text">G</span>RACIANO <span className="gold-text">D</span>HIMA
          </Link>

          <h1 className="heading text-3xl font-bold text-center">
            {isLogin ? a.loginTitle : a.registerTitle}
          </h1>
          <p className="text-sm text-muted text-center mt-2 mb-7">
            {isLogin ? a.loginSub : a.registerSub}
          </p>

          {checkEmail ? (
            <div>
              <p className="text-sm text-center border border-gold/40 bg-gold/10 px-4 py-4">
                {a.checkEmail}
              </p>
              {resendBlock}
            </div>
          ) : (
            <>
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                {!isLogin && (
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={a.name}
                    className={inputCls}
                  />
                )}
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={a.email}
                  className={inputCls}
                />
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={a.password}
                  className={inputCls}
                />
                {isLogin && (
                  <Link href="/forgot-password" className="text-xs text-muted hover:text-gold transition-colors self-end -mt-1">
                    {a.forgot}
                  </Link>
                )}
                {!isLogin && (
                  <label className="flex items-start gap-2.5 text-xs text-muted mt-1 cursor-pointer">
                    <input type="checkbox" required className="mt-0.5 accent-[#ffc800]" />
                    <span>
                      {a.consentPre}{" "}
                      <Link href="/terms" target="_blank" className="text-gold hover:underline">
                        {a.consentTerms}
                      </Link>{" "}
                      {a.consentAnd}{" "}
                      <Link href="/privacy" target="_blank" className="text-gold hover:underline">
                        {a.consentPrivacy}
                      </Link>
                    </span>
                  </label>
                )}
                {error && (
                  <p className="text-xs text-red-400">
                    {error}
                    {exists && (
                      <>
                        {" "}
                        <Link href="/login" className="text-gold hover:underline">
                          {a.errorExistsCta} →
                        </Link>
                      </>
                    )}
                  </p>
                )}
                {showResend && resendBlock}
                <button type="submit" disabled={loading} className="btn-gold w-full !justify-center disabled:opacity-60">
                  {loading ? "…" : isLogin ? a.login : a.register}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <span className="h-px flex-1 bg-line" />
                <span className="text-[10px] uppercase tracking-widest text-muted">or</span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <button onClick={withGoogle} className="btn-ghost w-full !justify-center flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.02.14 3.5 2.7.24.02c2.2-2 3.5-5 3.5-8.6z" />
                  <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.2 0-5.8-2.1-6.8-4.9l-.14.01-3.7 2.8-.05.13C3.3 21.3 7.3 24 12 24z" />
                  <path fill="#FBBC05" d="M5.2 14.5c-.25-.7-.4-1.5-.4-2.5s.14-1.7.4-2.5l-.01-.16-3.7-2.9-.12.06C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5l3.8-3z" />
                  <path fill="#EA4335" d="M12 4.6c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.4 6.5l3.8 3c1-2.8 3.6-4.9 6.8-4.9z" />
                </svg>
                {a.google}
              </button>
            </>
          )}

          <p className="text-xs text-muted text-center mt-6">
            {isLogin ? a.noAccount : a.haveAccount}{" "}
            <Link href={isLogin ? "/register" : "/login"} className="text-gold hover:underline">
              {isLogin ? a.toRegister : a.toLogin}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
