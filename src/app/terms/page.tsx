import type { Metadata } from "next";
import LegalPage, { LegalContent } from "@/components/LegalPage";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Terms of Service — Graciano Dhima",
  robots: { index: true },
};

const content: Record<Lang, LegalContent> = {
  en: {
    title: "Terms of Service",
    updated: "Last updated: July 8, 2026",
    intro:
      "These terms govern your use of gracianodhima.com and the training programs and coaching services sold on it. By creating an account or making a purchase you agree to them.",
    sections: [
      {
        h: "1. Who we are",
        p: [
          "The service is operated by Graciano Dhima, personal trainer, Tirana, Albania. Contact: via the contact form or WhatsApp (+355 68 768 3048).",
        ],
      },
      {
        h: "2. Your account",
        p: [
          "You must be at least 18 years old (or have a parent's consent) and provide accurate information. You are responsible for keeping your password safe. We may suspend accounts that abuse the service, share paid content, or attempt to breach security.",
        ],
      },
      {
        h: "3. Programs and coaching",
        p: [
          "Training programs are digital content: once purchased, they are available in your account for the period stated at purchase.",
          "Online coaching is a monthly service that renews until cancelled. You can cancel any time; cancellation takes effect at the end of the paid period.",
          "Programs are for your personal use only — sharing, reselling or republishing them is not permitted.",
        ],
      },
      {
        h: "4. Prices and payment",
        p: [
          "Prices are shown in euros (EUR) at checkout, including any applicable taxes. Payment is processed by our payment provider; we never store your card details.",
        ],
      },
      {
        h: "5. Refunds and the 14-day right of withdrawal",
        p: [
          "For digital programs: EU consumer law gives you a 14-day right of withdrawal, which you waive at checkout when you choose immediate access to the digital content. If you have not accessed the program, contact us within 14 days for a full refund.",
          "For monthly coaching: you may withdraw within 14 days of first purchase and receive a refund proportional to the unused service.",
        ],
      },
      {
        h: "6. Health disclaimer",
        p: [
          "Training involves physical effort and carries inherent risk. The programs and advice on this site are general fitness guidance, not medical advice. Consult a physician before starting any program, especially if you have a medical condition, injury, or are pregnant. Stop immediately and seek medical help if you feel pain, dizziness or discomfort. You train at your own risk. See the full Health Disclaimer page.",
        ],
      },
      {
        h: "7. Liability",
        p: [
          "To the maximum extent permitted by law, our liability is limited to the amount you paid for the service in question. Nothing in these terms limits liability that cannot be limited by law.",
        ],
      },
      {
        h: "8. Intellectual property",
        p: [
          "All content on this site — programs, videos, texts, branding — belongs to Graciano Dhima and may not be copied or distributed without written permission.",
        ],
      },
      {
        h: "9. Governing law",
        p: [
          "These terms are governed by the laws of the Republic of Albania. Mandatory consumer protections of your country of residence remain unaffected. Disputes go to the competent court in Tirana, unless consumer law says otherwise.",
        ],
      },
      {
        h: "10. Changes",
        p: [
          "We may update these terms; significant changes will be announced by email or on the site. Continued use after changes means acceptance.",
        ],
      },
    ],
  },
  sq: {
    title: "Kushtet e Shërbimit",
    updated: "Përditësuar më: 8 korrik 2026",
    intro:
      "Këto kushte rregullojnë përdorimin e gracianodhima.com dhe të programeve e shërbimeve të stërvitjes që shiten aty. Duke krijuar një llogari ose duke bërë një blerje, ti i pranon ato.",
    sections: [
      {
        h: "1. Kush jemi",
        p: [
          "Shërbimi operohet nga Graciano Dhima, trajner personal, Tiranë, Shqipëri. Kontakt: përmes formularit të kontaktit ose WhatsApp (+355 68 768 3048).",
        ],
      },
      {
        h: "2. Llogaria jote",
        p: [
          "Duhet të jesh të paktën 18 vjeç (ose me pëlqimin e prindit) dhe të japësh të dhëna të sakta. Ti je përgjegjës për ruajtjen e fjalëkalimit. Mund të pezullojmë llogari që abuzojnë me shërbimin, shpërndajnë përmbajtje me pagesë ose tentojnë të cenojnë sigurinë.",
        ],
      },
      {
        h: "3. Programet dhe stërvitja online",
        p: [
          "Programet e stërvitjes janë përmbajtje digjitale: pas blerjes, ato janë të disponueshme në llogarinë tënde për periudhën e shënuar në blerje.",
          "Stërvitja online është shërbim mujor që rinovohet derisa ta anulosh. Mund ta anulosh në çdo kohë; anulimi hyn në fuqi në fund të periudhës së paguar.",
          "Programet janë vetëm për përdorimin tënd personal — shpërndarja, rishitja ose ripublikimi nuk lejohen.",
        ],
      },
      {
        h: "4. Çmimet dhe pagesa",
        p: [
          "Çmimet shfaqen në euro (EUR) në arkë, përfshirë taksat e zbatueshme. Pagesa përpunohet nga ofruesi ynë i pagesave; ne nuk i ruajmë kurrë të dhënat e kartës.",
        ],
      },
      {
        h: "5. Rimbursimet dhe e drejta e tërheqjes 14-ditore",
        p: [
          "Për programet digjitale: ligji evropian i konsumatorit të jep 14 ditë të drejtë tërheqjeje, të cilën e heq dorë në arkë kur zgjedh qasje të menjëhershme në përmbajtjen digjitale. Nëse nuk e ke hapur programin, na kontakto brenda 14 ditësh për rimbursim të plotë.",
          "Për stërvitjen mujore: mund të tërhiqesh brenda 14 ditësh nga blerja e parë dhe të marrësh rimbursim proporcional me shërbimin e papërdorur.",
        ],
      },
      {
        h: "6. Deklarata shëndetësore",
        p: [
          "Stërvitja përfshin përpjekje fizike dhe mbart rrezik. Programet dhe këshillat në këtë faqe janë udhëzime të përgjithshme fitnesi, jo këshilla mjekësore. Konsultohu me mjekun para se të fillosh çdo program, sidomos nëse ke një gjendje mjekësore, dëmtim ose je shtatzënë. Ndalo menjëherë dhe kërko ndihmë mjekësore nëse ndien dhimbje, marramendje ose shqetësim. Stërvitesh me rrezikun tënd. Shiko faqen e plotë të Deklaratës Shëndetësore.",
        ],
      },
      {
        h: "7. Përgjegjësia",
        p: [
          "Në masën maksimale të lejuar nga ligji, përgjegjësia jonë kufizohet në shumën që ke paguar për shërbimin përkatës. Asgjë në këto kushte nuk kufizon përgjegjësi që nuk mund të kufizohet me ligj.",
        ],
      },
      {
        h: "8. Pronësia intelektuale",
        p: [
          "E gjithë përmbajtja e kësaj faqeje — programet, videot, tekstet, marka — i përket Graciano Dhimës dhe nuk mund të kopjohet a shpërndahet pa leje me shkrim.",
        ],
      },
      {
        h: "9. Ligji i zbatueshëm",
        p: [
          "Këto kushte rregullohen nga ligjet e Republikës së Shqipërisë. Mbrojtjet e detyrueshme të konsumatorit të vendit tënd të banimit mbeten të paprekura. Mosmarrëveshjet zgjidhen në gjykatën kompetente në Tiranë, përveç kur ligji i konsumatorit parashikon ndryshe.",
        ],
      },
      {
        h: "10. Ndryshimet",
        p: [
          "Mund t'i përditësojmë këto kushte; ndryshimet e rëndësishme do të njoftohen me email ose në faqe. Vazhdimi i përdorimit pas ndryshimeve do të thotë pranim.",
        ],
      },
    ],
  },
};

export default function TermsPage() {
  return <LegalPage content={content} />;
}
