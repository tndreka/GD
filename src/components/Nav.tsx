"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => setLoggedIn(!!session));
    return () => subscription.unsubscribe();
  }, []);

  const links = [
    { href: "#programs", label: t.nav.programs },
    { href: "#coaching", label: t.nav.coaching },
    { href: "#in-person", label: t.nav.inPerson },
    { href: "#about", label: t.nav.about },
    { href: "#faq", label: t.nav.faq },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-background/90 backdrop-blur border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-16 flex items-center justify-between">
        {/* Logo — replace with his real logo file at /public/logo.png when available */}
        <a href="#top" className="heading text-xl font-bold tracking-widest">
          <span className="gold-text">G</span>RACIANO <span className="gold-text">D</span>HIMA
        </a>

        <nav className="hidden lg:flex items-center gap-7 text-sm text-muted">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* language toggle */}
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

          {loggedIn ? (
            <a href="/dashboard" className="btn-ghost !py-2 !px-4 !text-xs hidden sm:inline-flex">
              {t.nav.dashboard}
            </a>
          ) : (
            <>
              <a href="/login" className="hidden sm:inline-flex text-xs text-muted hover:text-foreground transition-colors">
                {t.nav.login}
              </a>
              <a href="/register" className="btn-ghost !py-2 !px-4 !text-xs hidden sm:inline-flex">
                {t.nav.register}
              </a>
            </>
          )}

          <a href="#contact" className="btn-gold !py-2 !px-4 !text-xs hidden sm:inline-flex">
            {t.nav.cta}
          </a>

          {/* mobile menu button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-foreground transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <nav className="lg:hidden border-t border-line bg-background/95 backdrop-blur px-5 py-4 flex flex-col gap-4 text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-muted hover:text-foreground">
              {l.label}
            </a>
          ))}
          {loggedIn ? (
            <a href="/dashboard" onClick={() => setOpen(false)} className="btn-ghost !py-2.5 text-center">
              {t.nav.dashboard}
            </a>
          ) : (
            <>
              <a href="/login" onClick={() => setOpen(false)} className="text-muted hover:text-foreground text-center py-1">
                {t.nav.login}
              </a>
              <a href="/register" onClick={() => setOpen(false)} className="btn-ghost !py-2.5 text-center">
                {t.nav.register}
              </a>
            </>
          )}
          <a href="#contact" onClick={() => setOpen(false)} className="btn-gold !py-2.5 text-center">
            {t.nav.cta}
          </a>
        </nav>
      )}
    </header>
  );
}
