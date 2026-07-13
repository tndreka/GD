"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LangProvider, useLang, Lang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  is_admin: boolean;
};

type Program = {
  id: string;
  title_en: string;
  title_sq: string;
};

type PurchaseRow = {
  id: string;
  user_id: string;
  status: string;
  purchased_at: string;
  programs: Program | null;
};

type Contact = {
  id: string;
  name: string;
  email: string;
  goal: string;
  message: string | null;
  created_at: string;
};

type Lead = {
  id: string;
  email: string;
  created_at: string;
};

type Tab = "clients" | "access" | "apps" | "leads" | "health";

type HealthProfile = {
  user_id: string;
  birth_year: number | null;
  height_cm: number | null;
  start_weight_kg: number | null;
  goal: string | null;
  activity_level: string | null;
  injuries: string | null;
  medications: string | null;
  parq: Record<string, boolean>;
};

type CheckinRow = {
  id: string;
  weight_kg: number | null;
  energy: number | null;
  sleep: number | null;
  adherence: number | null;
  soreness: number | null;
  note: string | null;
  photo_front: string | null;
  photo_side: string | null;
  photo_back: string | null;
  created_at: string;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AdminInner() {
  const { lang, setLang, t } = useLang();
  const router = useRouter();
  const supabase = createClient();
  const a = t.admin;

  const [tab, setTab] = useState<Tab>("clients");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // grant form
  const [grantUser, setGrantUser] = useState("");
  const [grantProgram, setGrantProgram] = useState("");
  const [granting, setGranting] = useState(false);

  // health tab
  const [healthUser, setHealthUser] = useState("");
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null);
  const [healthCheckins, setHealthCheckins] = useState<CheckinRow[]>([]);
  const [healthLoading, setHealthLoading] = useState(false);

  const loadData = useCallback(async () => {
    const [p1, p2, p3, p4, p5] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, created_at, is_admin").order("created_at", { ascending: false }),
      supabase.from("programs").select("id, title_en, title_sq").eq("active", true).order("tier"),
      supabase.from("purchases").select("id, user_id, status, purchased_at, programs ( id, title_en, title_sq )").order("purchased_at", { ascending: false }),
      supabase.from("contact_submissions").select("id, name, email, goal, message, created_at").order("created_at", { ascending: false }),
      supabase.from("leads").select("id, email, created_at").order("created_at", { ascending: false }),
    ]);
    if (p1.error || p2.error || p3.error || p4.error || p5.error) setError(true);
    setProfiles(p1.data ?? []);
    setPrograms(p2.data ?? []);
    setPurchases((p3.data as unknown as PurchaseRow[]) ?? []);
    setContacts(p4.data ?? []);
    setLeads(p5.data ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const { data: me } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      if (!me?.is_admin) {
        router.replace("/dashboard");
        return;
      }
      await loadData();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clientOf = (userId: string) => profiles.find((p) => p.id === userId);
  const progTitle = (p: Program | null) => (p ? (lang === "sq" ? p.title_sq : p.title_en) : "—");

  async function grant() {
    if (!grantUser || !grantProgram) return;
    setGranting(true);
    setError(false);
    const { error: err } = await supabase
      .from("purchases")
      .insert({ user_id: grantUser, program_id: grantProgram, status: "active" });
    if (err) setError(true);
    else {
      setGrantUser("");
      setGrantProgram("");
      await loadData();
    }
    setGranting(false);
  }

  async function loadHealth(userId: string) {
    setHealthUser(userId);
    setHealthProfile(null);
    setHealthCheckins([]);
    if (!userId) return;
    setHealthLoading(true);
    const [{ data: hp }, { data: ci }] = await Promise.all([
      supabase.from("health_profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase
        .from("checkins")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
    ]);
    setHealthProfile((hp as HealthProfile) ?? null);
    setHealthCheckins((ci as CheckinRow[]) ?? []);
    setHealthLoading(false);
  }

  async function openPhoto(path: string) {
    const { data } = await supabase.storage.from("checkin-photos").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function setStatus(id: string, status: "active" | "expired") {
    setError(false);
    const { error: err } = await supabase.from("purchases").update({ status }).eq("id", id);
    if (err) setError(true);
    else await loadData();
  }

  const inputCls =
    "bg-surface-2 border border-line px-3 py-2.5 text-sm outline-none focus:border-gold w-full";
  const thCls = "text-left text-[10px] uppercase tracking-widest text-muted font-normal px-4 py-3";
  const tdCls = "px-4 py-3 text-sm border-t border-line";

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "clients", label: a.tabClients, count: profiles.length },
    { key: "access", label: a.tabAccess, count: purchases.length },
    { key: "health", label: a.tabHealth, count: profiles.filter((p) => !p.is_admin).length },
    { key: "apps", label: a.tabApps, count: contacts.length },
    { key: "leads", label: a.tabLeads, count: leads.length },
  ];

  const h = t.health;
  const parqFlagged =
    healthProfile && Object.values(healthProfile.parq ?? {}).some((v) => v === true);
  const weightsAdm = healthCheckins.filter((c) => c.weight_kg != null);
  const chartAdm = (() => {
    if (weightsAdm.length < 2) return null;
    const vals = weightsAdm.map((c) => Number(c.weight_kg));
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const span = max - min || 1;
    const pts = vals
      .map((v, i) => `${((i / (vals.length - 1)) * 280 + 10).toFixed(1)},${(70 - ((v - min) / span) * 55).toFixed(1)}`)
      .join(" ");
    return { pts, first: vals[0], last: vals[vals.length - 1] };
  })();

  return (
    <div className="min-h-svh">
      <header className="border-b border-line bg-background/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="heading text-lg font-bold tracking-widest">
            <span className="gold-text">G</span>RACIANO <span className="gold-text">D</span>HIMA
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-xs text-muted hover:text-foreground transition-colors">
              {a.backToDash}
            </Link>
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
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <p className="section-tag">{a.title}</p>
        <h1 className="heading text-4xl sm:text-5xl font-bold">{a.title}</h1>
        <p className="text-muted mt-3">{a.sub}</p>

        {loading ? (
          <div className="card p-6 h-40 animate-pulse mt-10" />
        ) : (
          <>
            {/* tabs */}
            <div className="flex flex-wrap gap-2 mt-10">
              {tabs.map((tb) => (
                <button
                  key={tb.key}
                  onClick={() => setTab(tb.key)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                    tab === tb.key
                      ? "bg-gold text-black border-gold font-bold"
                      : "border-line text-muted hover:text-foreground"
                  }`}
                >
                  {tb.label} ({tb.count})
                </button>
              ))}
            </div>

            {error && (
              <p className="text-xs text-red-400 mt-4" role="alert">
                {a.error}
              </p>
            )}

            {/* CLIENTS */}
            {tab === "clients" && (
              <div className="card mt-6 overflow-x-auto">
                {profiles.length === 0 ? (
                  <p className="text-muted text-sm p-8 text-center">{a.emptyClients}</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className={thCls}>{a.name}</th>
                        <th className={thCls}>{a.email}</th>
                        <th className={thCls}>{a.joined}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map((p) => (
                        <tr key={p.id}>
                          <td className={tdCls}>
                            {p.full_name ?? "—"}
                            {p.is_admin && (
                              <span className="ml-2 text-[10px] uppercase tracking-widest text-gold border border-gold/50 px-1.5 py-0.5">
                                Admin
                              </span>
                            )}
                          </td>
                          <td className={`${tdCls} text-muted`}>{p.email ?? "—"}</td>
                          <td className={`${tdCls} text-muted`}>{fmtDate(p.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ACCESS */}
            {tab === "access" && (
              <>
                <div className="card p-5 mt-6">
                  <p className="text-xs uppercase tracking-widest text-muted mb-3">{a.grantTitle}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select value={grantUser} onChange={(e) => setGrantUser(e.target.value)} className={inputCls}>
                      <option value="">{a.selectClient}</option>
                      {profiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.full_name ?? p.email} ({p.email})
                        </option>
                      ))}
                    </select>
                    <select value={grantProgram} onChange={(e) => setGrantProgram(e.target.value)} className={inputCls}>
                      <option value="">{a.selectProgram}</option>
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {lang === "sq" ? p.title_sq : p.title_en}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={grant}
                      disabled={granting || !grantUser || !grantProgram}
                      className="btn-gold !justify-center shrink-0 disabled:opacity-50"
                    >
                      {granting ? "…" : a.grant}
                    </button>
                  </div>
                </div>

                <div className="card mt-4 overflow-x-auto">
                  {purchases.length === 0 ? (
                    <p className="text-muted text-sm p-8 text-center">{a.emptyAccess}</p>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className={thCls}>{a.email}</th>
                          <th className={thCls}>{a.program}</th>
                          <th className={thCls}>{a.status}</th>
                          <th className={thCls}>{a.date}</th>
                          <th className={thCls}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map((p) => (
                          <tr key={p.id}>
                            <td className={tdCls}>{clientOf(p.user_id)?.email ?? p.user_id.slice(0, 8)}</td>
                            <td className={tdCls}>{progTitle(p.programs)}</td>
                            <td className={tdCls}>
                              <span
                                className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                                  p.status === "active" ? "border-gold/50 text-gold" : "border-line text-muted"
                                }`}
                              >
                                {p.status === "active" ? a.active : a.expired}
                              </span>
                            </td>
                            <td className={`${tdCls} text-muted`}>{fmtDate(p.purchased_at)}</td>
                            <td className={`${tdCls} text-right`}>
                              {p.status === "active" ? (
                                <button
                                  onClick={() => setStatus(p.id, "expired")}
                                  className="text-xs text-muted hover:text-red-400 transition-colors"
                                >
                                  {a.revoke}
                                </button>
                              ) : (
                                <button
                                  onClick={() => setStatus(p.id, "active")}
                                  className="text-xs text-muted hover:text-gold transition-colors"
                                >
                                  {a.reactivate}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}

            {/* HEALTH / CHECK-INS */}
            {tab === "health" && (
              <div className="mt-6">
                <select
                  value={healthUser}
                  onChange={(e) => loadHealth(e.target.value)}
                  className={`${inputCls} max-w-md`}
                >
                  <option value="">{a.selectClient}</option>
                  {profiles
                    .filter((p) => !p.is_admin)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name ?? p.email} ({p.email})
                      </option>
                    ))}
                </select>

                {healthLoading && <div className="card p-6 h-24 animate-pulse mt-4" />}

                {!healthLoading && healthUser && !healthProfile && (
                  <p className="text-sm text-muted mt-4">{a.noHealth}</p>
                )}

                {!healthLoading && healthProfile && (
                  <>
                    <div className="card p-5 mt-4">
                      {parqFlagged && (
                        <p className="text-xs text-gold border border-gold/40 bg-gold/10 px-4 py-3 mb-4">
                          ⚠ {a.flag}
                        </p>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted">{h.birthYear}</p>
                          <p className="mt-1">{healthProfile.birth_year ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted">{h.height}</p>
                          <p className="mt-1">{healthProfile.height_cm ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted">{h.startWeight}</p>
                          <p className="mt-1">{healthProfile.start_weight_kg ?? "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted">{h.goal}</p>
                          <p className="mt-1">
                            {healthProfile.goal != null ? h.goalOptions[Number(healthProfile.goal)] ?? "—" : "—"}
                          </p>
                        </div>
                      </div>
                      {(healthProfile.injuries || healthProfile.medications) && (
                        <div className="mt-4 text-sm text-muted border-t border-line pt-4">
                          {healthProfile.injuries && (
                            <p>
                              <span className="text-foreground">{h.injuries}:</span> {healthProfile.injuries}
                            </p>
                          )}
                          {healthProfile.medications && (
                            <p className="mt-1">
                              <span className="text-foreground">{h.medications}:</span> {healthProfile.medications}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {chartAdm && (
                      <div className="card p-5 mt-4">
                        <div className="flex justify-between text-xs text-muted mb-2">
                          <span className="uppercase tracking-widest">{h.chartTitle}</span>
                          <span>
                            {chartAdm.first} → <span className="text-gold font-bold">{chartAdm.last} {h.kg}</span>
                          </span>
                        </div>
                        <svg viewBox="0 0 300 80" className="w-full border border-line bg-surface-2">
                          <polyline points={chartAdm.pts} fill="none" stroke="#ffc800" strokeWidth="2" />
                        </svg>
                      </div>
                    )}

                    <div className="card mt-4 overflow-x-auto">
                      {healthCheckins.length === 0 ? (
                        <p className="text-muted text-sm p-8 text-center">{h.noCheckins}</p>
                      ) : (
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className={thCls}>{h.date}</th>
                              <th className={thCls}>{h.weight}</th>
                              <th className={thCls}>{h.energy}</th>
                              <th className={thCls}>{h.sleep}</th>
                              <th className={thCls}>{h.adherence}</th>
                              <th className={thCls}>{h.soreness}</th>
                              <th className={thCls}>{h.photos}</th>
                              <th className={thCls}>{h.note}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...healthCheckins].reverse().map((c) => (
                              <tr key={c.id}>
                                <td className={`${tdCls} text-muted`}>{fmtDate(c.created_at)}</td>
                                <td className={tdCls}>{c.weight_kg ?? "—"}</td>
                                <td className={tdCls}>{c.energy ?? "—"}</td>
                                <td className={tdCls}>{c.sleep ?? "—"}</td>
                                <td className={tdCls}>{c.adherence ?? "—"}</td>
                                <td className={tdCls}>{c.soreness ?? "—"}</td>
                                <td className={tdCls}>
                                  <span className="flex gap-2">
                                    {c.photo_front && (
                                      <button onClick={() => openPhoto(c.photo_front!)} className="text-xs text-gold hover:underline">
                                        F
                                      </button>
                                    )}
                                    {c.photo_side && (
                                      <button onClick={() => openPhoto(c.photo_side!)} className="text-xs text-gold hover:underline">
                                        S
                                      </button>
                                    )}
                                    {c.photo_back && (
                                      <button onClick={() => openPhoto(c.photo_back!)} className="text-xs text-gold hover:underline">
                                        B
                                      </button>
                                    )}
                                    {!c.photo_front && !c.photo_side && !c.photo_back && "—"}
                                  </span>
                                </td>
                                <td className={`${tdCls} text-muted max-w-[200px] truncate`}>{c.note ?? "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* APPLICATIONS */}
            {tab === "apps" && (
              <div className="mt-6 flex flex-col gap-4">
                {contacts.length === 0 ? (
                  <div className="card p-8 text-center text-muted text-sm">{a.emptyApps}</div>
                ) : (
                  contacts.map((c) => (
                    <div key={c.id} className="card p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-bold">
                          {c.name} <span className="text-muted font-normal text-sm">— {c.email}</span>
                        </p>
                        <p className="text-xs text-muted">{fmtDate(c.created_at)}</p>
                      </div>
                      <p className="text-xs uppercase tracking-widest text-gold mt-3">
                        {a.goal}: {c.goal}
                      </p>
                      {c.message && <p className="text-sm text-muted mt-2 whitespace-pre-line">{c.message}</p>}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* LEADS */}
            {tab === "leads" && (
              <div className="card mt-6 overflow-x-auto">
                {leads.length === 0 ? (
                  <p className="text-muted text-sm p-8 text-center">{a.emptyLeads}</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className={thCls}>{a.email}</th>
                        <th className={thCls}>{a.date}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((l) => (
                        <tr key={l.id}>
                          <td className={tdCls}>{l.email}</td>
                          <td className={`${tdCls} text-muted`}>{fmtDate(l.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <LangProvider>
      <AdminInner />
    </LangProvider>
  );
}
