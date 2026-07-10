"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LangProvider, useLang, Lang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

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
  const [loading, setLoading] = useState(true);

  const d = t.dash;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
          supabase.from("exercise_progress").select("program_id").eq("user_id", user.id),
        ]);
      const { data: health } = await supabase
        .from("health_profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) setHasHealth(!!health);

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
        <p className="section-tag">{d.welcome}{name ? ` — ${name}` : ""}</p>
        <h1 className="heading text-4xl sm:text-5xl font-bold">{d.title}</h1>
        <p className="text-muted mt-3">{d.sub}</p>

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
