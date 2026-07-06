"use client";

import { LangProvider } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { Stats, Programs, Coaching, InPerson, Transformations, About, Faq, LeadMagnet, Contact, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <LangProvider>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Programs />
        <Coaching />
        <InPerson />
        <Transformations />
        <About />
        <Faq />
        <LeadMagnet />
        <Contact />
      </main>
      <Footer />
    </LangProvider>
  );
}
