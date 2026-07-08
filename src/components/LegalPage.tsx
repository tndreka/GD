"use client";

import Link from "next/link";
import { LangProvider, useLang, Lang } from "@/lib/i18n";

export type LegalContent = {
  title: string;
  updated: string;
  intro?: string;
  sections: { h: string; p: string[] }[];
};

function LegalInner({ content }: { content: Record<Lang, LegalContent> }) {
  const { lang, setLang } = useLang();
  const c = content[lang];

  return (
    <div className="min-h-svh">
      <header className="border-b border-line bg-background/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-3xl px-5 h-16 flex items-center justify-between">
          <Link href="/" className="heading text-lg font-bold tracking-widest">
            <span className="gold-text">G</span>RACIANO <span className="gold-text">D</span>HIMA
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

      <main className="mx-auto max-w-3xl px-5 py-14">
        <h1 className="heading text-4xl font-bold">{c.title}</h1>
        <p className="text-xs text-muted mt-2 uppercase tracking-widest">{c.updated}</p>
        {c.intro && <p className="text-muted mt-6 leading-relaxed">{c.intro}</p>}

        {c.sections.map((s) => (
          <section key={s.h} className="mt-10">
            <h2 className="heading text-xl font-bold gold-text">{s.h}</h2>
            {s.p.map((para, i) => (
              <p key={i} className="text-sm text-muted mt-3 leading-relaxed whitespace-pre-line">
                {para}
              </p>
            ))}
          </section>
        ))}

        <div className="mt-14 border-t border-line pt-6">
          <Link href="/" className="text-xs text-muted hover:text-gold transition-colors">
            ← gracianodhima.com
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function LegalPage({ content }: { content: Record<Lang, LegalContent> }) {
  return (
    <LangProvider>
      <LegalInner content={content} />
    </LangProvider>
  );
}
