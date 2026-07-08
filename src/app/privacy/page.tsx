import type { Metadata } from "next";
import LegalPage, { LegalContent } from "@/components/LegalPage";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy — Graciano Dhima",
  robots: { index: true },
};

const content: Record<Lang, LegalContent> = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: July 8, 2026",
    intro:
      "This policy explains how Graciano Dhima (\"we\", \"us\") collects and uses your personal data when you use gracianodhima.com. We keep it short and honest — we collect only what we need to run the coaching service.",
    sections: [
      {
        h: "1. Who is responsible",
        p: [
          "Data controller: Graciano Dhima, personal trainer, Tirana, Albania.\nContact: via the contact form on this site or WhatsApp (+355 68 768 3048).",
        ],
      },
      {
        h: "2. What we collect",
        p: [
          "Account data: your name, email address and encrypted password when you register (or your Google account email if you sign in with Google).",
          "Purchase data: which programs you buy and when. Card details are processed by our payment provider and never touch our servers.",
          "Contact data: what you send us through the contact or free-guide forms (name, email, your goal, your message).",
          "Technical data: strictly necessary cookies used to keep you logged in. We do not run advertising cookies without asking you first.",
        ],
      },
      {
        h: "3. Why we collect it (legal basis)",
        p: [
          "To provide your account and deliver programs you bought — performance of a contract.",
          "To answer your enquiries — our legitimate interest in responding to you.",
          "To send you the free guide or occasional training emails — your consent, which you can withdraw at any time via the unsubscribe link.",
        ],
      },
      {
        h: "4. Where your data lives",
        p: [
          "Your account data is stored with Supabase on servers in the European Union (Frankfurt, Germany). Emails are delivered through our email provider. We do not sell or rent your data to anyone.",
        ],
      },
      {
        h: "5. How long we keep it",
        p: [
          "Account data: for as long as your account exists. Contact messages: up to 24 months. Purchase records: as long as required by accounting law.",
        ],
      },
      {
        h: "6. Your rights",
        p: [
          "Under the GDPR and Albanian Law No. 9887 on Personal Data Protection you can: access a copy of your data, correct it, delete your account and data, restrict or object to processing, and take your data elsewhere (portability).",
          "To exercise any of these, message us via the contact form or WhatsApp. We respond within 30 days. You may also complain to the Albanian Information and Data Protection Commissioner (IDP).",
        ],
      },
      {
        h: "7. Changes",
        p: [
          "If we change this policy we will update the date above and, for significant changes, notify you by email.",
        ],
      },
    ],
  },
  sq: {
    title: "Politika e Privatësisë",
    updated: "Përditësuar më: 8 korrik 2026",
    intro:
      "Kjo politikë shpjegon si Graciano Dhima (\"ne\") mbledh dhe përdor të dhënat e tua personale kur përdor gracianodhima.com. E mbajmë të shkurtër dhe të sinqertë — mbledhim vetëm atë që na duhet për të ofruar shërbimin e stërvitjes.",
    sections: [
      {
        h: "1. Kush është përgjegjës",
        p: [
          "Kontrolluesi i të dhënave: Graciano Dhima, trajner personal, Tiranë, Shqipëri.\nKontakt: përmes formularit të kontaktit në këtë faqe ose WhatsApp (+355 68 768 3048).",
        ],
      },
      {
        h: "2. Çfarë mbledhim",
        p: [
          "Të dhëna llogarie: emri, adresa e email-it dhe fjalëkalimi i enkriptuar kur regjistrohesh (ose email-i i llogarisë Google nëse hyn me Google).",
          "Të dhëna blerjesh: cilat programe blen dhe kur. Të dhënat e kartës përpunohen nga ofruesi ynë i pagesave dhe nuk prekin asnjëherë serverët tanë.",
          "Të dhëna kontakti: ajo që na dërgon përmes formularëve të kontaktit ose udhëzuesit falas (emri, email-i, qëllimi, mesazhi).",
          "Të dhëna teknike: cookies rreptësisht të nevojshme që të mbajnë të kyçur. Nuk përdorim cookies reklamash pa të pyetur më parë.",
        ],
      },
      {
        h: "3. Pse i mbledhim (baza ligjore)",
        p: [
          "Për të ofruar llogarinë tënde dhe programet që ke blerë — përmbushje e kontratës.",
          "Për t'iu përgjigjur pyetjeve të tua — interesi ynë legjitim për të të kthyer përgjigje.",
          "Për të të dërguar udhëzuesin falas ose email-e stërvitjeje herë pas here — pëlqimi yt, të cilin mund ta tërheqësh në çdo kohë përmes linkut të çregjistrimit.",
        ],
      },
      {
        h: "4. Ku ruhen të dhënat",
        p: [
          "Të dhënat e llogarisë ruhen te Supabase në serverë brenda Bashkimit Evropian (Frankfurt, Gjermani). Email-et dërgohen përmes ofruesit tonë të email-it. Nuk i shesim dhe nuk i japim me qira të dhënat e tua askujt.",
        ],
      },
      {
        h: "5. Sa gjatë i mbajmë",
        p: [
          "Të dhënat e llogarisë: sa kohë ekziston llogaria. Mesazhet e kontaktit: deri në 24 muaj. Regjistrimet e blerjeve: aq sa e kërkon ligji i kontabilitetit.",
        ],
      },
      {
        h: "6. Të drejtat e tua",
        p: [
          "Sipas GDPR dhe Ligjit shqiptar Nr. 9887 për Mbrojtjen e të Dhënave Personale ti mund të: marrësh një kopje të të dhënave, t'i korrigjosh, të fshish llogarinë dhe të dhënat, të kufizosh ose kundërshtosh përpunimin, dhe t'i transferosh të dhënat diku tjetër.",
          "Për t'i ushtruar këto të drejta, na shkruaj përmes formularit të kontaktit ose WhatsApp. Përgjigjemi brenda 30 ditësh. Mund të ankohesh edhe pranë Komisionerit për të Drejtën e Informimit dhe Mbrojtjen e të Dhënave Personale (IDP).",
        ],
      },
      {
        h: "7. Ndryshimet",
        p: [
          "Nëse e ndryshojmë këtë politikë, do të përditësojmë datën më lart dhe, për ndryshime të rëndësishme, do të të njoftojmë me email.",
        ],
      },
    ],
  },
};

export default function PrivacyPage() {
  return <LegalPage content={content} />;
}
