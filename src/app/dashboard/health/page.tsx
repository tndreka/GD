"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LangProvider, useLang, Lang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

type Checkin = {
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

const PARQ_KEYS = ["heart", "chest_pain", "chest_pain_rest", "dizzy", "joints", "meds", "other"];

function HealthInner() {
  const { lang, setLang, t } = useLang();
  const router = useRouter();
  const supabase = createClient();
  const h = t.health;

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  // profile form
  const [birthYear, setBirthYear] = useState("");
  const [height, setHeight] = useState("");
  const [startWeight, setStartWeight] = useState("");
  const [goal, setGoal] = useState(0);
  const [activity, setActivity] = useState(0);
  const [injuries, setInjuries] = useState("");
  const [medications, setMedications] = useState("");
  const [parq, setParq] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // check-in form
  const [weight, setWeight] = useState("");
  const [energy, setEnergy] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [adherence, setAdherence] = useState(5);
  const [soreness, setSoreness] = useState(5);
  const [note, setNote] = useState("");
  const [photoFiles, setPhotoFiles] = useState<Record<string, File | null>>({});
  const [savingCheckin, setSavingCheckin] = useState(false);
  const [checkinMsg, setCheckinMsg] = useState<string | null>(null);

  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [compareUrls, setCompareUrls] = useState<{ first?: string; last?: string }>({});
  const [checkedThisWeek, setCheckedThisWeek] = useState(false);

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
      const [{ data: profile }, { data: rows }] = await Promise.all([
        supabase.from("health_profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("checkins")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true }),
      ]);
      if (cancelled) return;
      setUserId(user.id);
      if (profile) {
        setHasProfile(true);
        setBirthYear(profile.birth_year?.toString() ?? "");
        setHeight(profile.height_cm?.toString() ?? "");
        setStartWeight(profile.start_weight_kg?.toString() ?? "");
        setGoal(profile.goal ? Number(profile.goal) : 0);
        setActivity(profile.activity_level ? Number(profile.activity_level) : 0);
        setInjuries(profile.injuries ?? "");
        setMedications(profile.medications ?? "");
        setParq(profile.parq ?? {});
        setConsent(true);
      }
      const list = (rows as Checkin[]) ?? [];
      setCheckins(list);
      const last = list[list.length - 1];
      setCheckedThisWeek(
        !!last && Date.now() - new Date(last.created_at).getTime() < 7 * 86400000
      );
      // before/now photos
      const withPhoto = list.filter((c) => c.photo_front);
      if (withPhoto.length > 0) {
        const first = withPhoto[0];
        const last = withPhoto[withPhoto.length - 1];
        const urls: { first?: string; last?: string } = {};
        const r1 = await supabase.storage
          .from("checkin-photos")
          .createSignedUrl(first.photo_front!, 600);
        if (r1.data?.signedUrl) urls.first = r1.data.signedUrl;
        if (last.id !== first.id) {
          const r2 = await supabase.storage
            .from("checkin-photos")
            .createSignedUrl(last.photo_front!, 600);
          if (r2.data?.signedUrl) urls.last = r2.data.signedUrl;
        }
        if (!cancelled) setCompareUrls(urls);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parqFlagged = PARQ_KEYS.some((k) => parq[k] === true);
  const parqComplete = PARQ_KEYS.every((k) => typeof parq[k] === "boolean");

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    if (!userId || !parqComplete) return;
    setSavingProfile(true);
    setProfileMsg(null);
    const { error } = await supabase.from("health_profiles").upsert({
      user_id: userId,
      birth_year: birthYear ? Number(birthYear) : null,
      height_cm: height ? Number(height) : null,
      start_weight_kg: startWeight ? Number(startWeight) : null,
      goal: String(goal),
      activity_level: String(activity),
      injuries: injuries || null,
      medications: medications || null,
      parq,
      consent_version: "v1",
      updated_at: new Date().toISOString(),
    });
    setSavingProfile(false);
    if (error) {
      setProfileMsg(h.error);
      return;
    }
    setHasProfile(true);
    setProfileMsg(h.saved);
  }

  async function submitCheckin(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSavingCheckin(true);
    setCheckinMsg(null);
    try {
      const paths: Record<string, string | null> = {
        photo_front: null,
        photo_side: null,
        photo_back: null,
      };
      for (const key of ["front", "side", "back"]) {
        const file = photoFiles[key];
        if (!file) continue;
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${userId}/${Date.now()}-${key}.${ext}`;
        const { error } = await supabase.storage.from("checkin-photos").upload(path, file);
        if (error) throw error;
        paths[`photo_${key}`] = path;
      }
      const { data, error } = await supabase
        .from("checkins")
        .insert({
          user_id: userId,
          weight_kg: weight ? Number(weight) : null,
          energy,
          sleep,
          adherence,
          soreness,
          note: note || null,
          ...paths,
        })
        .select()
        .single();
      if (error) throw error;
      setCheckins((c) => [...c, data as Checkin]);
      setCheckedThisWeek(true);
      setWeight("");
      setNote("");
      setPhotoFiles({});
      setCheckinMsg(h.submitted);
    } catch {
      setCheckinMsg(h.error);
    } finally {
      setSavingCheckin(false);
    }
  }

  const weights = checkins.filter((c) => c.weight_kg != null);
  const chart = (() => {
    if (weights.length < 2) return null;
    const vals = weights.map((c) => Number(c.weight_kg));
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const span = max - min || 1;
    const pts = vals
      .map((v, i) => {
        const x = (i / (vals.length - 1)) * 280 + 10;
        const y = 70 - ((v - min) / span) * 55;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
    return { pts, min, max, first: vals[0], last: vals[vals.length - 1] };
  })();

  const inputCls =
    "bg-surface-2 border border-line px-4 py-3 text-sm outline-none focus:border-gold w-full";

  const slider = (label: string, value: number, set: (n: number) => void) => (
    <div>
      <div className="flex justify-between text-xs text-muted mb-1.5">
        <span>{label}</span>
        <span className="text-gold font-bold">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full accent-[#ffc800]"
      />
    </div>
  );

  return (
    <div className="min-h-svh">
      <header className="border-b border-line bg-background/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-xs text-muted hover:text-foreground transition-colors">
            {t.viewer.back}
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
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="heading text-4xl sm:text-5xl font-bold">{h.title}</h1>
        <p className="text-muted mt-3">{h.sub}</p>

        {loading ? (
          <div className="card p-6 h-40 animate-pulse mt-10" />
        ) : (
          <>
            {/* ---- baseline profile ---- */}
            <form onSubmit={saveProfile} className="card p-6 mt-10">
              <h2 className="heading text-2xl font-bold">{h.profileTitle}</h2>
              <div className="grid sm:grid-cols-3 gap-3 mt-5">
                <input
                  type="number"
                  min={1920}
                  max={2020}
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder={h.birthYear}
                  className={inputCls}
                />
                <input
                  type="number"
                  min={100}
                  max={250}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={h.height}
                  className={inputCls}
                />
                <input
                  type="number"
                  step="0.1"
                  min={30}
                  max={300}
                  value={startWeight}
                  onChange={(e) => setStartWeight(e.target.value)}
                  placeholder={h.startWeight}
                  className={inputCls}
                />
              </div>

              <p className="text-xs uppercase tracking-widest text-muted mt-6 mb-2">{h.goal}</p>
              <div className="flex flex-wrap gap-2">
                {h.goalOptions.map((g: string, i: number) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGoal(i)}
                    className={`px-3 py-2 text-xs border transition-colors ${
                      goal === i ? "bg-gold text-black border-gold font-bold" : "border-line text-muted hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <p className="text-xs uppercase tracking-widest text-muted mt-6 mb-2">{h.activity}</p>
              <div className="flex flex-wrap gap-2">
                {h.activityOptions.map((g: string, i: number) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setActivity(i)}
                    className={`px-3 py-2 text-xs border transition-colors ${
                      activity === i ? "bg-gold text-black border-gold font-bold" : "border-line text-muted hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                <textarea
                  value={injuries}
                  onChange={(e) => setInjuries(e.target.value)}
                  placeholder={h.injuries}
                  rows={2}
                  className={inputCls}
                />
                <textarea
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder={h.medications}
                  rows={2}
                  className={inputCls}
                />
              </div>

              {/* PAR-Q */}
              <h3 className="heading text-lg font-bold mt-8">{h.parqTitle}</h3>
              <p className="text-xs text-muted mt-1 mb-4">{h.parqSub}</p>
              <div className="flex flex-col gap-3">
                {h.parq.map((q: string, i: number) => (
                  <div key={PARQ_KEYS[i]} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted">{q}</span>
                    <div className="flex gap-1 shrink-0">
                      {[true, false].map((val) => (
                        <button
                          type="button"
                          key={String(val)}
                          onClick={() => setParq((p) => ({ ...p, [PARQ_KEYS[i]]: val }))}
                          className={`px-3 py-1.5 text-xs border transition-colors ${
                            parq[PARQ_KEYS[i]] === val
                              ? "bg-gold text-black border-gold font-bold"
                              : "border-line text-muted hover:text-foreground"
                          }`}
                        >
                          {val ? h.yes : h.no}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {parqFlagged && (
                <p className="text-xs text-gold border border-gold/40 bg-gold/10 px-4 py-3 mt-5">
                  ⚠ {h.parqWarning}
                </p>
              )}

              <label className="flex items-start gap-2.5 text-xs text-muted mt-6 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-[#ffc800]"
                />
                <span>{h.consent}</span>
              </label>

              {profileMsg && <p className="text-xs text-gold mt-4">{profileMsg}</p>}
              <button
                type="submit"
                disabled={savingProfile || !parqComplete || !consent}
                className="btn-gold mt-5 disabled:opacity-50"
              >
                {savingProfile ? "…" : h.save}
              </button>
            </form>

            {/* ---- weekly check-in ---- */}
            {hasProfile && (
              <div className="card p-6 mt-8">
                <h2 className="heading text-2xl font-bold">{h.checkinTitle}</h2>
                <p className="text-xs text-muted mt-1">{h.checkinSub}</p>

                {checkedThisWeek && checkinMsg !== h.submitted ? (
                  <p className="text-sm text-muted border border-line px-4 py-3 mt-5">
                    {h.alreadyThisWeek}
                  </p>
                ) : checkinMsg === h.submitted ? (
                  <p className="text-sm text-gold border border-gold/40 bg-gold/10 px-4 py-3 mt-5">
                    {h.submitted}
                  </p>
                ) : (
                  <form onSubmit={submitCheckin} className="mt-5 flex flex-col gap-5">
                    <input
                      type="number"
                      step="0.1"
                      min={30}
                      max={300}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder={h.weight}
                      className={inputCls}
                    />
                    {slider(h.energy, energy, setEnergy)}
                    {slider(h.sleep, sleep, setSleep)}
                    {slider(h.adherence, adherence, setAdherence)}
                    {slider(h.soreness, soreness, setSoreness)}
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={h.note}
                      rows={2}
                      className={inputCls}
                    />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted mb-2">{h.photos}</p>
                      <div className="grid grid-cols-3 gap-3">
                        {(["front", "side", "back"] as const).map((k) => (
                          <label key={k} className="text-xs text-muted cursor-pointer">
                            <span className="block mb-1">
                              {k === "front" ? h.photoFront : k === "side" ? h.photoSide : h.photoBack}
                              {photoFiles[k] ? " ✓" : ""}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                setPhotoFiles((p) => ({ ...p, [k]: e.target.files?.[0] ?? null }))
                              }
                            />
                            <span className="block border border-dashed border-line hover:border-gold px-3 py-4 text-center transition-colors">
                              {photoFiles[k]?.name ?? "+"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {checkinMsg && checkinMsg !== h.submitted && (
                      <p className="text-xs text-red-400">{checkinMsg}</p>
                    )}
                    <button type="submit" disabled={savingCheckin} className="btn-gold self-start disabled:opacity-60">
                      {savingCheckin ? "…" : h.submit}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ---- history ---- */}
            {hasProfile && (
              <div className="card p-6 mt-8">
                <h2 className="heading text-2xl font-bold">{h.historyTitle}</h2>

                {checkins.length === 0 ? (
                  <p className="text-sm text-muted mt-4">{h.noCheckins}</p>
                ) : (
                  <>
                    {chart && (
                      <div className="mt-5">
                        <div className="flex justify-between text-xs text-muted mb-2">
                          <span className="uppercase tracking-widest">{h.chartTitle}</span>
                          <span>
                            {chart.first} → <span className="text-gold font-bold">{chart.last} {h.kg}</span>
                          </span>
                        </div>
                        <svg viewBox="0 0 300 80" className="w-full border border-line bg-surface-2">
                          <polyline
                            points={chart.pts}
                            fill="none"
                            stroke="#ffc800"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    )}

                    {(compareUrls.first || compareUrls.last) && (
                      <div className="mt-6">
                        <p className="text-xs uppercase tracking-widest text-muted mb-2">{h.compareTitle}</p>
                        <div className="grid grid-cols-2 gap-3">
                          {compareUrls.first && (
                            <figure>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={compareUrls.first} alt={h.compareFirst} className="w-full border border-line" />
                              <figcaption className="text-xs text-muted mt-1">{h.compareFirst}</figcaption>
                            </figure>
                          )}
                          {compareUrls.last && (
                            <figure>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={compareUrls.last} alt={h.compareLast} className="w-full border border-line" />
                              <figcaption className="text-xs text-muted mt-1">{h.compareLast}</figcaption>
                            </figure>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-[10px] uppercase tracking-widest text-muted">
                            <th className="text-left font-normal py-2 pr-3">{h.date}</th>
                            <th className="text-center font-normal py-2 px-2">{h.weight}</th>
                            <th className="text-center font-normal py-2 px-2">{h.energy}</th>
                            <th className="text-center font-normal py-2 px-2">{h.sleep}</th>
                            <th className="text-center font-normal py-2 px-2">{h.adherence}</th>
                            <th className="text-center font-normal py-2 pl-2">{h.soreness}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...checkins].reverse().map((c) => (
                            <tr key={c.id} className="border-t border-line">
                              <td className="py-2.5 pr-3 text-muted">
                                {new Date(c.created_at).toLocaleDateString(lang === "sq" ? "sq-AL" : "en-GB")}
                              </td>
                              <td className="text-center px-2">{c.weight_kg ?? "—"}</td>
                              <td className="text-center px-2">{c.energy ?? "—"}</td>
                              <td className="text-center px-2">{c.sleep ?? "—"}</td>
                              <td className="text-center px-2">{c.adherence ?? "—"}</td>
                              <td className="text-center pl-2">{c.soreness ?? "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function HealthPage() {
  return (
    <LangProvider>
      <HealthInner />
    </LangProvider>
  );
}
