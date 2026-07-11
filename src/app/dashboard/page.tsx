"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LangProvider, useLang, Lang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

type StoreProgram = {
  id: string;
  slug: string;
  title_en: string;
  title_sq: string;
  description_en: string | null;
  description_sq: string | null;
  price_cents: number;
};

// Monday-based week index (days since epoch, shifted so weeks start Monday)
function weekIndex(ms: number) {
  return Math.floor((ms / 86400000 + 3) / 7);
}

type Purchase = {
  id: string;
  status: string;
  purchased_at: string;
  programs: {
    id: string;
    slug: string;
    title_en: string;
    title_sq: string;
    description_en: string | null;
    description_sq: string | null;
    tier: number;
  } | null;
};

function DashboardInner() {
  const { lang, setLang, t } = useLang();
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [progress, setProgress] = useState<Record<string, { done: number; total: number }>>({});
  const [hasHealth, setHasHealth] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalDone, setTotalDone] = useState(0);
  const [store, setStore] = useState<StoreProgram[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [paySuccess, setPaySuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const d = t.dash;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!cancelled && window.location.search.includes("purchase=success")) {
        setPaySuccess(true);
        window.history.replaceState(null, "", "/dashboard");
      }
      if (!user) {
        router.replace("/login");
        return;
      }

      const [{ data: profile }, { data: rows }, { data: totals }, { data: mine }] =
        await Promise.all([
          supabase.from("profiles").select("full_name, is_admin").eq("id", user.id).single(),
          supabase
            .from("purchases")
            .select(
              "id, status, purchased_at, programs ( id, slug, title_en, title_sq, description_en, description_sq, tier )"
            )
            .order("purchased_at", { ascending: false }),
          supabase.from("program_exercises").select("program_id"),
          supabase
            .from("exercise_progress")
            .select("program_id, completed_at")
            .eq("user_id", user.id),
        ]);
      const [{ data: health }, { data: allProgs }] = await Promise.all([
        supabase.from("health_profiles").select("user_id").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("programs")
          .select("id, slug, title_en, title_sq, description_en, description_sq, price_cents")
          .eq("active", true)
          .gt("price_cents", 0)
          .order("price_cents"),
      ]);
      if (cancelled) return;
      setHasHealth(!!health);

      // streak: consecutive weeks (Mon-based) with at least one completed exercise
      const weekSet = new Set((mine ?? []).map((r) => weekIndex(new Date(r.completed_at).getTime())));
      let cur = weekIndex(Date.now());
      if (!weekSet.has(cur)) cur -= 1; // grace: current week not started yet
      let s = 0;
      while (weekSet.has(cur)) {
        s += 1;
        cur -= 1;
      }
      setStreak(s);
      setTotalDone((mine ?? []).length);

      const ownedIds = new Set(
        ((rows as unknown as Purchase[]) ?? [])
          .filter((p) => p.status === "active")
          .map((p) => p.programs?.id)
          .filter(Boolean)
      );
      setStore(((allProgs as StoreProgram[]) ?? []).filter((p) => !ownedIds.has(p.id)));

      if (cancelled) return;
      setName(profile?.full_name ?? user.email ?? null);
      setIsAdmin(profile?.is_admin ?? false);
      setPurchases((rows as unknown as Purchase[]) ?? []);
      const prog: Record<string, { done: number; total: number }> = {};
      (totals ?? []).forEach((r) => {
        prog[r.program_id] = prog[r.program_id] ?? { done: 0, total: 0 };
        prog[r.program_id].total += 1;
      });
      (mine ?? []).forEach((r) => {
        prog[r.program_id] = prog[r.program_id] ?? { done: 0, total: 0 };
        prog[r.program_id].done += 1;
      });
      setProgress(prog);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function buy(slug: string) {
    setStoreError(null);
    setBusy(slug);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      setStoreError(t.programs.checkoutError);
    } catch {
      setStoreError(t.programs.checkoutError);
    } finally {
      setBusy(null);
    }
  }

  const g = t.gamify;
  const anyComplete = Object.values(progress).some((p) => p.total > 0 && p.done >= p.total);
  const badges = [
    { key: "first", earned: totalDone >= 1 },
    { key: "ex25", earned: totalDone >= 25 },
    { key: "ex100", earned: totalDone >= 100 },
    { key: "streak2", earned: streak >= 2 },
    { key: "streak4", earned: streak >= 4 },
    { key: "complete", earned: anyComplete },
  ];
  const earnedCount = badges.filter((b) => b.earned).length;

  const title = (p: Purchase) => (lang === "sq" ? p.programs?.title_sq : p.programs?.title_en);
  const desc = (p: Purchase) =>
    lang === "sq" ? p.programs?.description_sq : p.programs?.description_en;

  return (
    <div className="min-h-svh">
      {/* header */}
      <header className="border-b border-line bg-background/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between">
          <Link href="/" className="heading text-lg font-bold tracking-widest">
            <span className="gold-text">G</span>RACIANO <span className="gold-text">D</span>HIMA
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/health"
              className="text-xs text-muted hover:text-gold uppercase tracking-widest hidden sm:inline"
            >
              {t.health.link}
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-xs text-gold hover:underline uppercase tracking-widest">
                {d.admin}
              </Link>
            )}
            <div className="flex text-xs font-bold border border-line overflow-hidden">
              {(["en", "sq"] as Lang[]).map((l) => (
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
            <button onClick={logout} className="btn-ghost !py-2 !px-4 !text-xs">
              {d.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        {paySuccess && (
          <div className="card card-featured p-4 mb-8 text-sm text-gold" role="status">
            {d.paySuccess}
          </div>
        )}

        <p className="section-tag">{d.welcome}{name ? ` — ${name}` : ""}</p>
        <h1 className="heading text-4xl sm:text-5xl font-bold">{d.title}</h1>
        <p className="text-muted mt-3">{d.sub}</p>

        {/* stats row */}
        {!loading && (
          <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
            <div className="card p-4 sm:p-6 text-center">
              <div className="heading text-3xl sm:text-4xl font-bold gold-text">
                {streak > 0 ? "🔥 " : ""}{streak}
              </div>
              <div className="mt-1 text-[10px] sm:text-xs text-muted uppercase tracking-widest">{g.streak}</div>
            </div>
            <div className="card p-4 sm:p-6 text-center">
              <div className="heading text-3xl sm:text-4xl font-bold gold-text">{totalDone}</div>
              <div className="mt-1 text-[10px] sm:text-xs text-muted uppercase tracking-widest">{g.exercises}</div>
            </div>
            <div className="card p-4 sm:p-6 text-center">
              <div className="heading text-3xl sm:text-4xl font-bold gold-text">
                {earnedCount}/{badges.length}
              </div>
              <div className="mt-1 text-[10px] sm:text-xs text-muted uppercase tracking-widest">{g.achievements}</div>
            </div>
          </div>
        )}

        {/* badges */}
        {!loading && (
          <div className="mt-5 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b.key}
                className={`text-[10px] uppercase tracking-widest px-2.5 py-1.5 border ${
                  b.earned ? "border-gold/60 text-gold bg-gold/10" : "border-line text-muted/50"
                }`}
              >
                {b.earned ? "★ " : "☆ "}
                {g.badges[b.key as keyof typeof g.badges]}
              </span>
            ))}
          </div>
        )}

        {!loading && !hasHealth && (
          <div className="card card-featured p-5 mt-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold">{t.health.promptTitle}</p>
              <p className="text-sm text-muted mt-1">{t.health.promptDesc}</p>
            </div>
            <Link href="/dashboard/health" className="btn-gold !py-2.5 !px-5 !text-xs shrink-0">
              {t.health.promptCta} →
            </Link>
          </div>
        )}

        {loading ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="card p-6 h-40 animate-pulse" />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="card p-10 mt-12 text-center">
            <p className="text-muted">{d.empty}</p>
            <Link href="/#programs" className="btn-gold inline-flex mt-6">
              {d.emptyCta}
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {purchases.map((p) => (
              <div key={p.id} className="card p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <h2 className="heading text-xl font-bold">{title(p)}</h2>
                  <span
                    className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                      p.status === "active"
                        ? "border-gold/50 text-gold"
                        : "border-line text-muted"
                    }`}
                  >
                    {p.status === "active" ? d.statusActive : d.statusExpired}
                  </span>
                </div>
                <p className="text-sm text-muted mt-3 flex-1">{desc(p)}</p>
                {p.programs?.id &&
                  progress[p.programs.id] &&
                  progress[p.programs.id].total > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted mb-1.5">
                        <span>{t.viewer.progress}</span>
                        <span>
                          {Math.round(
                            (progress[p.programs.id].done / progress[p.programs.id].total) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-1 bg-surface-2 border border-line overflow-hidden">
                        <div
                          className="h-full bg-gold"
                          style={{
                            width: `${Math.round((progress[p.programs.id].done / progress[p.programs.id].total) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                {p.status === "active" && p.programs?.slug ? (
                  <Link
                    href={`/dashboard/${p.programs.slug}`}
                    className="btn-gold inline-flex self-start mt-5 !py-2.5 !px-5 !text-xs"
                  >
                    {d.open} →
                  </Link>
                ) : (
                  <p className="text-xs text-muted mt-5 border-t border-line pt-4">{d.soon}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* in-dashboard store */}
        {!loading && store.length > 0 && (
          <div className="mt-16">
            <h2 className="heading text-2xl sm:text-3xl font-bold">{g.storeTitle}</h2>
            <p className="text-sm text-muted mt-2">{g.storeSub}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {store.map((p) => (
                <div key={p.id} className="card p-6 flex flex-col">
                  <h3 className="heading text-lg font-bold">
                    {lang === "sq" ? p.title_sq : p.title_en}
                  </h3>
                  <p className="text-sm text-muted mt-2 flex-1">
                    {lang === "sq" ? p.description_sq : p.description_en}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="heading text-2xl font-bold gold-text">
                      €{(p.price_cents / 100).toFixed(0)}
                    </span>
                    <button
                      onClick={() => buy(p.slug)}
                      disabled={busy !== null}
                      className="btn-gold !py-2.5 !px-5 !text-xs disabled:opacity-60"
                    >
                      {busy === p.slug ? t.programs.buying : t.programs.buy}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {storeError && <p className="mt-4 text-sm text-red-400">{storeError}</p>}
          </div>
        )}

        <p className="mt-16 border-t border-line pt-6">
          <Link href="/reset-password" className="text-xs text-muted hover:text-gold transition-colors">
            {d.changePw}
          </Link>
        </p>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <LangProvider>
      <DashboardInner />
    </LangProvider>
  );
}
