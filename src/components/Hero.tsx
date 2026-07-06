"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

/**
 * Hero with training-video background.
 * Drop the real clip at /public/videos/hero.mp4 (10–30s, muted, landscape).
 * Optional mobile/vertical clip: /public/videos/hero-mobile.mp4.
 * Until then an animated dark-gold placeholder is shown.
 */
export default function Hero() {
  const { t } = useLang();
  const [videoOk, setVideoOk] = useState(true);

  return (
    <section id="top" className="relative min-h-svh flex items-center justify-center overflow-hidden">
      {/* background layers */}
      <div className="hero-placeholder" />
      {videoOk && (
        <>
          {/* landscape clip for desktop/tablet */}
          <video
            className="hero-video hidden md:block"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoOk(false)}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          {/* vertical clip for phones */}
          <video
            className="hero-video md:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoOk(false)}
          >
            <source src="/videos/hero-mobile.mp4" type="video/mp4" />
          </video>
        </>
      )}
      <div className="hero-grid" />
      <div className="hero-overlay" />

      {/* content */}
      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto pt-16">
        <p className="section-tag">{t.hero.tag}</p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold leading-[0.95]">
          {t.hero.title1} <br />
          <span className="gold-text">{t.hero.title2}</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl mx-auto">{t.hero.sub}</p>
        <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contact" className="btn-gold">{t.hero.cta1}</a>
          <a href="#programs" className="btn-ghost">{t.hero.cta2}</a>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted text-xs tracking-widest uppercase">
        {t.hero.scroll}
        <span className="block w-px h-8 bg-gradient-to-b from-gold to-transparent animate-pulse" />
      </div>
    </section>
  );
}
