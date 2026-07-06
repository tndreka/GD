"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import Reveal from "./Reveal";

const WHATSAPP_URL = "https://wa.me/355687683048";
const INSTAGRAM_URL = "https://www.instagram.com/graciano_dhima/";

export function Stats() {
  const { t } = useLang();
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {t.stats.map((s: { value: string; label: string }, i: number) => (
          <Reveal key={s.label} delay={i * 80} className="text-center">
            <div className="heading text-4xl md:text-5xl font-bold gold-text">{s.value}</div>
            <div className="mt-1 text-xs md:text-sm text-muted uppercase tracking-widest">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Programs() {
  const { t } = useLang();
  return (
    <section id="programs" className="mx-auto max-w-7xl px-5 md:px-8 py-24">
      <Reveal className="text-center max-w-2xl mx-auto">
        <p className="section-tag">{t.programs.tag}</p>
        <h2 className="text-4xl md:text-5xl font-bold">{t.programs.title}</h2>
        <p className="mt-4 text-muted">{t.programs.sub}</p>
      </Reveal>

      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {t.programs.items.map((p: { name: string; desc: string; badge: string }, i: number) => (
          <Reveal key={p.name} delay={i * 120}>
            <div className="card p-8 h-full flex flex-col">
              {/* program visual placeholder — swap with his real program artwork */}
              <div className="h-40 bg-surface-2 border border-line flex items-center justify-center mb-6">
                <span className="heading text-3xl font-bold gold-text">{p.name}</span>
              </div>
              {p.badge && (
                <span className="self-start text-[10px] font-bold uppercase tracking-widest bg-gold text-black px-2 py-1 mb-3">
                  {p.badge}
                </span>
              )}
              <h3 className="text-2xl font-bold">{p.name}</h3>
              <p className="mt-3 text-sm text-muted flex-1">{p.desc}</p>
              <p className="mt-4 text-xs text-muted uppercase tracking-widest">{t.programs.price}</p>
              {/* price placeholder */}
              <div className="mt-2 heading text-3xl font-bold gold-text">€—</div>
              <a href="#contact" className="btn-gold mt-6 !w-full">{t.programs.cta}</a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Coaching() {
  const { t } = useLang();
  return (
    <section id="coaching" className="bg-surface border-y border-line">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-24">
        <Reveal className="text-center max-w-2xl mx-auto">
          <p className="section-tag">{t.coaching.tag}</p>
          <h2 className="text-4xl md:text-5xl font-bold">{t.coaching.title}</h2>
          <p className="mt-4 text-muted">{t.coaching.sub}</p>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {t.coaching.tiers.map((tier: { name: string; featured: boolean; features: string[]; cta: string; note: string }, i: number) => (
            <Reveal key={tier.name} delay={i * 120}>
              <div className={`card p-8 h-full flex flex-col ${tier.featured ? "card-featured" : ""}`}>
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <p className="mt-1 text-xs gold-text uppercase tracking-widest">{tier.note}</p>
                {/* price placeholder */}
                <div className="mt-5 heading text-4xl font-bold">
                  €—<span className="text-base text-muted font-normal">/mo</span>
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-muted">
                      <span className="gold-text mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`${tier.featured ? "btn-gold" : "btn-ghost"} mt-8 !w-full`}>
                  {tier.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InPerson() {
  const { t } = useLang();
  return (
    <section id="in-person" className="mx-auto max-w-7xl px-5 md:px-8 py-24">
      <Reveal className="text-center max-w-2xl mx-auto">
        <p className="section-tag">{t.inPerson.tag}</p>
        <h2 className="text-4xl md:text-5xl font-bold">{t.inPerson.title}</h2>
      </Reveal>
      <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {t.inPerson.items.map((item: { name: string; desc: string }, i: number) => (
          <Reveal key={item.name} delay={i * 120}>
            <div className="card p-8 h-full flex flex-col">
              <h3 className="text-2xl font-bold">{item.name}</h3>
              <p className="mt-3 text-sm text-muted flex-1">{item.desc}</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-6 self-start">
                {t.inPerson.cta}
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Transformations() {
  const { t } = useLang();
  return (
    <section className="bg-surface border-y border-line">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-24">
        <Reveal className="text-center max-w-2xl mx-auto">
          <p className="section-tag">{t.transformations.tag}</p>
          <h2 className="text-4xl md:text-5xl font-bold">{t.transformations.title}</h2>
          <p className="mt-4 text-muted">{t.transformations.sub}</p>
        </Reveal>
        {/* Placeholder cards — replace with real before/after photos + testimonial quotes */}
        <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n, i) => (
            <Reveal key={n} delay={i * 120}>
              <div className="card aspect-[4/5] flex items-center justify-center">
                <span className="text-muted text-sm uppercase tracking-widest">{t.transformations.placeholder}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  const { t } = useLang();
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 md:px-8 py-24 grid md:grid-cols-2 gap-12 items-center">
      {/* Photo placeholder — replace with his real portrait */}
      <Reveal>
        <div className="card aspect-[4/5] flex items-center justify-center max-w-md mx-auto w-full">
          <span className="heading text-6xl font-bold gold-text">GD</span>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <p className="section-tag">{t.about.tag}</p>
        <h2 className="text-4xl md:text-5xl font-bold">{t.about.title}</h2>
        <p className="mt-6 text-muted leading-relaxed">{t.about.p1}</p>
        <p className="mt-4 text-muted leading-relaxed">{t.about.p2}</p>
        <ul className="mt-6 space-y-2">
          {t.about.points.map((p: string) => (
            <li key={p} className="flex gap-3 text-sm">
              <span className="gold-text">■</span> {p}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function Faq() {
  const { t } = useLang();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-surface border-y border-line">
      <div className="mx-auto max-w-3xl px-5 md:px-8 py-24">
        <Reveal className="text-center">
          <p className="section-tag">{t.faq.tag}</p>
          <h2 className="text-4xl md:text-5xl font-bold">{t.faq.title}</h2>
        </Reveal>
        <div className="mt-12 space-y-3">
          {t.faq.items.map((item: { q: string; a: string }, i: number) => (
            <Reveal key={item.q} delay={i * 60}>
              <div className="card !transform-none">
                <button
                  className="w-full text-left px-6 py-5 flex justify-between items-center gap-4"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                >
                  <span className="font-semibold">{item.q}</span>
                  <span className={`gold-text text-xl transition-transform ${openIdx === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openIdx === i && <p className="px-6 pb-5 text-sm text-muted">{item.a}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LeadMagnet() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8 py-24">
      <Reveal>
        <div className="card card-featured p-10 md:p-14 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">{t.lead.title}</h2>
          <p className="mt-3 text-muted">{t.lead.sub}</p>
          {sent ? (
            <p className="mt-8 gold-text font-semibold">✓</p>
          ) : (
            <form
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true); // TODO: wire to email tool (MailerLite) / API route
              }}
            >
              <input
                type="email"
                required
                placeholder={t.lead.placeholder}
                className="flex-1 bg-surface-2 border border-line px-4 py-3 text-sm outline-none focus:border-gold"
              />
              <button type="submit" className="btn-gold !py-3">{t.lead.cta}</button>
            </form>
          )}
          <p className="mt-4 text-xs text-muted">{t.lead.note}</p>
        </div>
      </Reveal>
    </section>
  );
}

export function Contact() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="bg-surface border-t border-line">
      <div className="mx-auto max-w-3xl px-5 md:px-8 py-24">
        <Reveal className="text-center">
          <p className="section-tag">{t.contact.tag}</p>
          <h2 className="text-4xl md:text-5xl font-bold">{t.contact.title}</h2>
          <p className="mt-4 text-muted">{t.contact.sub}</p>
        </Reveal>

        <Reveal delay={120}>
          {sent ? (
            <p className="mt-12 text-center gold-text font-semibold text-lg">✓</p>
          ) : (
            <form
              className="mt-12 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true); // TODO: wire to API route / email notification
              }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input required placeholder={t.contact.name} className="bg-surface-2 border border-line px-4 py-3 text-sm outline-none focus:border-gold w-full" />
                <input required type="email" placeholder={t.contact.email} className="bg-surface-2 border border-line px-4 py-3 text-sm outline-none focus:border-gold w-full" />
              </div>
              <select required defaultValue="" className="bg-surface-2 border border-line px-4 py-3 text-sm outline-none focus:border-gold w-full text-muted">
                <option value="" disabled>{t.contact.goal}</option>
                {t.contact.goalOptions.map((g: string) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <textarea rows={4} placeholder={t.contact.message} className="bg-surface-2 border border-line px-4 py-3 text-sm outline-none focus:border-gold w-full" />
              <button type="submit" className="btn-gold w-full">{t.contact.cta}</button>
            </form>
          )}
        </Reveal>

        <Reveal delay={200} className="mt-10 text-center">
          <p className="text-xs text-muted uppercase tracking-widest">{t.contact.or}</p>
          <div className="mt-4 flex justify-center gap-4">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-2.5 !px-5 !text-xs">
              {t.contact.whatsapp}
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-2.5 !px-5 !text-xs">
              {t.contact.instagram}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
        <span className="heading font-bold text-foreground tracking-widest">
          <span className="gold-text">G</span>RACIANO <span className="gold-text">D</span>HIMA
        </span>
        <span className="gold-text uppercase tracking-widest text-xs">{t.footer.tagline}</span>
        <span className="text-xs">© {new Date().getFullYear()} Graciano Dhima. {t.footer.rights}</span>
      </div>
    </footer>
  );
}
