import type { Metadata } from "next";
import LegalPage, { LegalContent } from "@/components/LegalPage";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Health Disclaimer — Graciano Dhima",
  robots: { index: true },
};

const content: Record<Lang, LegalContent> = {
  en: {
    title: "Health Disclaimer",
    updated: "Last updated: July 8, 2026",
    intro:
      "Please read this before starting any program or coaching plan from gracianodhima.com.",
    sections: [
      {
        h: "Not medical advice",
        p: [
          "Graciano Dhima is a certified personal trainer, not a physician. All programs, videos, texts and coaching advice on this site are general fitness and exercise guidance. They are not medical advice, diagnosis or treatment, and they do not replace consultation with a doctor or physiotherapist.",
        ],
      },
      {
        h: "Talk to your doctor first",
        p: [
          "Consult a physician before beginning any exercise or nutrition program, especially if you: have a heart condition, high blood pressure, diabetes, or any chronic illness; have a current or past injury; take medication that affects physical activity; are pregnant or recently gave birth; or have not exercised in a long time.",
        ],
      },
      {
        h: "Listen to your body",
        p: [
          "Stop exercising immediately and seek medical attention if you experience chest pain, severe shortness of breath, dizziness, faintness, or sharp joint pain. Mild muscle soreness is normal; pain is not.",
        ],
      },
      {
        h: "Your responsibility",
        p: [
          "Exercise carries an inherent risk of injury. By using the programs and advice on this site you accept that you train voluntarily and at your own risk, that results vary from person to person and are not guaranteed, and that you are responsible for using correct technique, appropriate weights and a safe training environment.",
        ],
      },
    ],
  },
  sq: {
    title: "Deklaratë Shëndetësore",
    updated: "Përditësuar më: 8 korrik 2026",
    intro:
      "Të lutem lexoje këtë para se të fillosh çdo program ose plan stërvitjeje nga gracianodhima.com.",
    sections: [
      {
        h: "Nuk është këshillë mjekësore",
        p: [
          "Graciano Dhima është trajner personal i certifikuar, jo mjek. Të gjitha programet, videot, tekstet dhe këshillat e stërvitjes në këtë faqe janë udhëzime të përgjithshme fitnesi dhe ushtrimesh. Ato nuk janë këshillë mjekësore, diagnozë apo trajtim dhe nuk zëvendësojnë konsultën me mjekun ose fizioterapistin.",
        ],
      },
      {
        h: "Fol me mjekun më parë",
        p: [
          "Konsultohu me mjekun para se të fillosh çdo program ushtrimesh ose ushqyerjeje, sidomos nëse: ke probleme me zemrën, tension të lartë, diabet ose ndonjë sëmundje kronike; ke një dëmtim aktual ose të mëparshëm; merr medikamente që ndikojnë në aktivitetin fizik; je shtatzënë ose ke lindur së fundmi; ose nuk je stërvitur prej kohësh.",
        ],
      },
      {
        h: "Dëgjo trupin tënd",
        p: [
          "Ndalo stërvitjen menjëherë dhe kërko ndihmë mjekësore nëse ndien dhimbje gjoksi, vështirësi të rëndë në frymëmarrje, marramendje, të fikët ose dhimbje të mprehtë në nyje. Dhimbja e lehtë e muskujve është normale; dhimbja e vërtetë jo.",
        ],
      },
      {
        h: "Përgjegjësia jote",
        p: [
          "Ushtrimet mbartin rrezik të natyrshëm dëmtimi. Duke përdorur programet dhe këshillat e kësaj faqeje, ti pranon se stërvitesh vullnetarisht dhe me rrezikun tënd, se rezultatet ndryshojnë nga personi në person dhe nuk garantohen, dhe se je përgjegjës për teknikën e saktë, peshat e përshtatshme dhe një mjedis të sigurt stërvitjeje.",
        ],
      },
    ],
  },
};

export default function DisclaimerPage() {
  return <LegalPage content={content} />;
}
