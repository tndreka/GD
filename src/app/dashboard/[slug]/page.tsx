"use client";

import { Fragment, useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LangProvider, useLang, Lang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

type Program = {
  id: string;
  slug: string;
  title_en: string;
  title_sq: string;
  description_en: string | null;
  description_sq: string | null;
};

type FileRow = {
  id: string;
  title_en: string;
  title_sq: string;
  storage_path: string;
};

type Exercise = {
  id: string;
  sort: number;
  name_en: string;
  name_sq: string;
  sets: string | null;
  reps: string | null;
  rest: string | null;
  video_url: string | null;
  notes_en: string | null;
  notes_sq: string | null;
};

type Day = {
  id: string;
  day_number: number;
  title_en: string;
  title_sq: string;
  notes_en: string | null;
  notes_sq: string | null;
  program_exercises: Exercise[];
};

type Week = {
  id: string;
  week_number: number;
  title_en: string | null;
  title_sq: string | null;
  program_days: Day[];
};

function toEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function ProgramInner({ slug }: { slug: string }) {
  const { lang, setLang, t } = useLang();
  const router = useRouter();
  const supabase = createClient();
  const v = t.viewer;

  const [program, setProgram] = useState<Program | null>(null);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [activeWeek, setActiveWeek] = useState(0);
  const [openVideo, setOpenVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);

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

      const { data: prog } = await supabase
        .from("programs")
        .select("id, slug, title_en, title_sq, description_en, description_sq")
        .eq("slug", slug)
        .single();
      if (!prog) {
        router.replace("/dashboard");
        return;
      }

      const [fRes, wRes] = await Promise.all([
        supabase
          .from("program_files")
          .select("id, title_en, title_sq, storage_path")
          .eq("program_id", prog.id)
          .order("sort"),
        supabase
          .from("program_weeks")
          .select(
            "id, week_number, title_en, title_sq, program_days ( id, day_number, title_en, title_sq, notes_en, notes_sq, program_exercises ( id, sort, name_en, name_sq, sets, reps, rest, video_url, notes_en, notes_sq ) )"
          )
          .eq("program_id", prog.id)
          .order("week_number"),
      ]);

      if (cancelled) return;

      // RLS returns empty for users without access — check if it's a lock
      if ((wRes.data ?? []).length === 0 && (fRes.data ?? []).length === 0) {
        const { data: mine } = await supabase
          .from("purchases")
          .select("id")
          .eq("program_id", prog.id)
          .eq("status", "active")
          .limit(1);
        const { data: me } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        if (!mine?.length && !me?.is_admin) {
          setLocked(true);
        }
      }

      const sorted = ((wRes.data as unknown as Week[]) ?? []).map((w) => ({
        ...w,
        program_days: (w.program_days ?? [])
          .sort((a, b) => a.day_number - b.day_number)
          .map((d) => ({
            ...d,
            program_exercises: (d.program_exercises ?? []).sort((a, b) => a.sort - b.sort),
          })),
      }));

      setProgram(prog);
      setFiles(fRes.data ?? []);
      setWeeks(sorted);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function download(f: FileRow) {
    const { data } = await supabase.storage
      .from("program-files")
      .createSignedUrl(f.storage_path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  const L = <T extends Record<string, unknown>>(row: T, base: string) =>
    (lang === "sq" ? row[`${base}_sq`] : row[`${base}_en`]) as string | null;

  const week = weeks[activeWeek];

  return (
    <div className="min-h-svh">
      <header className="border-b border-line bg-background/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-xs text-muted hover:text-foreground transition-colors">
            {v.back}
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
        {loading ? (
          <div className="card p-6 h-40 animate-pulse" />
        ) : locked ? (
          <div className="card p-10 text-center">
            <p className="text-muted">{v.locked}</p>
            <Link href="/dashboard" className="btn-gold inline-flex mt-6">
              {v.back}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="heading text-4xl sm:text-5xl font-bold">{L(program ?? {}, "title")}</h1>
            {program && L(program, "description") && (
              <p className="text-muted mt-3">{L(program, "description")}</p>
            )}

            {files.length > 0 && (
              <div className="card p-5 mt-8">
                <p className="text-xs uppercase tracking-widest text-muted mb-3">{v.materials}</p>
                <div className="flex flex-col gap-2">
                  {files.map((f) => (
                    <div key={f.id} className="flex items-center justify-between gap-3">
                      <p className="text-sm">{L(f, "title")}</p>
                      <button onClick={() => download(f)} className="text-xs text-gold hover:underline shrink-0">
                        {v.download} ↓
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {weeks.length === 0 ? (
              <div className="card p-10 mt-8 text-center">
                <p className="text-muted">{v.empty}</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mt-10">
                  {weeks.map((w, i) => (
                    <button
                      key={w.id}
                      onClick={() => setActiveWeek(i)}
                      className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                        i === activeWeek
                          ? "bg-gold text-black border-gold font-bold"
                          : "border-line text-muted hover:text-foreground"
                      }`}
                    >
                      {v.week} {w.week_number}
                      {L(w, "title") ? ` — ${L(w, "title")}` : ""}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-5">
                  {week?.program_days.map((d) => (
                    <div key={d.id} className="card p-5">
                      <h2 className="heading text-xl font-bold">
                        {d.day_number}. {L(d, "title")}
                      </h2>
                      {L(d, "notes") && <p className="text-xs text-muted mt-1.5">{L(d, "notes")}</p>}

                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-[10px] uppercase tracking-widest text-muted">
                              <th className="text-left font-normal py-2 pr-3">{v.exercise}</th>
                              <th className="text-center font-normal py-2 px-3">{v.sets}</th>
                              <th className="text-center font-normal py-2 px-3">{v.reps}</th>
                              <th className="text-center font-normal py-2 pl-3">{v.rest}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {d.program_exercises.map((ex) => {
                              const embed = ex.video_url ? toEmbed(ex.video_url) : null;
                              return (
                                <Fragment key={ex.id}>
                                  <tr className="border-t border-line">
                                    <td className="py-3 pr-3">
                                      {L(ex, "name")}
                                      {L(ex, "notes") && (
                                        <span className="block text-xs text-muted mt-0.5">{L(ex, "notes")}</span>
                                      )}
                                      {embed && (
                                        <button
                                          onClick={() => setOpenVideo(openVideo === ex.id ? null : ex.id)}
                                          className="block text-xs text-gold hover:underline mt-1"
                                        >
                                          {openVideo === ex.id ? v.hideVideo : `▶ ${v.video}`}
                                        </button>
                                      )}
                                    </td>
                                    <td className="text-center px-3">{ex.sets ?? "—"}</td>
                                    <td className="text-center px-3">{ex.reps ?? "—"}</td>
                                    <td className="text-center pl-3">{ex.rest ?? "—"}</td>
                                  </tr>
                                  {embed && openVideo === ex.id && (
                                    <tr key={`${ex.id}-video`}>
                                      <td colSpan={4} className="pb-4">
                                        <div className="aspect-video w-full">
                                          <iframe
                                            src={embed}
                                            className="w-full h-full border border-line"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={L(ex, "name") ?? "video"}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <LangProvider>
      <ProgramInner slug={slug} />
    </LangProvider>
  );
}
