"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "sq";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const dict: Record<Lang, any> = {
  en: {
    nav: { programs: "Programs", coaching: "Coaching", inPerson: "In-Person", about: "About", faq: "FAQ", contact: "Contact", cta: "Start Now", login: "Log In", register: "Register", dashboard: "My Programs", logout: "Log Out" },
    hero: {
      tag: "Biomechanics · Posture · Strength",
      title1: "From Pain",
      title2: "To Performance",
      sub: "Train with purpose. Move with confidence. Online coaching and proven programs by Graciano Dhima — built on biomechanics, not guesswork.",
      cta1: "Start Your Transformation",
      cta2: "View Programs",
      scroll: "Scroll",
    },
    stats: [
      { value: "26K+", label: "Community" },
      { value: "10+", label: "Years of Coaching" },
      { value: "500+", label: "Clients Trained" },
      { value: "3", label: "Signature Programs" },
    ],
    programs: {
      tag: "Train Anywhere",
      title: "Signature Programs",
      sub: "Self-guided plans built by Graciano. Start today, train at your own pace.",
      cta: "Get the Program",
      items: [
        { name: "TRX", desc: "Full-body suspension training. Build strength, stability and control with just a TRX strap.", badge: "Best Seller" },
        { name: "Posture", desc: "Fix rounded shoulders, release back and neck tension, move pain-free. The program his coaching is famous for.", badge: "Signature" },
        { name: "Summer Body", desc: "Lean out and build visible muscle with structured progressive workouts.", badge: "" },
      ],
      price: "One-time purchase · Instant access",
    },
    coaching: {
      tag: "Work With Graciano",
      title: "Online Coaching",
      sub: "More than a workout plan — a coach in your corner.",
      tiers: [
        {
          name: "Online Coaching",
          featured: true,
          features: ["Personalized training plan", "Nutrition guidance", "Weekly check-ins & adjustments", "Direct chat support", "Progress tracking"],
          cta: "Apply Now",
          note: "Monthly subscription",
        },
        {
          name: "Premium 1:1",
          featured: false,
          features: ["Everything in Online Coaching", "Fully individualized programming", "Video form reviews", "1:1 video calls", "Priority support, daily contact"],
          cta: "Apply for 1:1",
          note: "Limited spots",
        },
      ],
    },
    inPerson: {
      tag: "In Tirana",
      title: "In-Person Training",
      items: [
        { name: "1:1 Personal Training", desc: "Train directly with Graciano at the gym. Biomechanics-first coaching, tailored to your body." },
        { name: "TRX Group Training", desc: "Small group sessions (4–8 people), twice a week. Improve posture, build strength from the inside out." },
      ],
      cta: "Book via WhatsApp",
    },
    transformations: {
      tag: "Real Results",
      title: "Transformations",
      sub: "Real clients. Real progress.",
      placeholder: "Before / After",
    },
    about: {
      tag: "The Coach",
      title: "Graciano Dhima",
      p1: "Personal trainer and TRX specialist with a decade of experience helping people move from pain to performance. My method starts where most coaching ends: biomechanics, posture and movement quality — because a body that moves well is a body that performs.",
      p2: "Whether you train with me online, through my programs, or in person in Tirana — every plan is personal. No templates. No guesswork.",
      points: ["Certified Personal Trainer", "TRX Specialist", "Posture & Movement Coach"],
    },
    faq: {
      tag: "Questions",
      title: "FAQ",
      items: [
        { q: "I'm a complete beginner. Can I join?", a: "Yes. Every plan adapts to your level — the intake quiz and first check-in make sure you start exactly where you should." },
        { q: "Do I need a gym membership?", a: "No. Programs and coaching adapt to your equipment — gym, home setup, or just a TRX strap." },
        { q: "How is online coaching delivered?", a: "Through a coaching app: your workouts, nutrition targets and check-ins in one place, with direct chat with Graciano." },
        { q: "What if it doesn't work for me?", a: "Reach out within the first 14 days and we'll fix the plan or find a solution together." },
      ],
    },
    lead: {
      title: "Free Training Guide",
      sub: "Get Graciano's free guide and start improving your posture and strength today.",
      placeholder: "Your email",
      cta: "Send Me the Guide",
      note: "No spam. Unsubscribe anytime.",
      successMsg: "You're in! The guide is on its way to your inbox.",
      errorMsg: "Something went wrong — please try again.",
    },
    contact: {
      tag: "Get Started",
      title: "Ready to Transform?",
      sub: "Apply and Graciano will get back to you personally.",
      name: "Name",
      email: "Email",
      goal: "Your goal",
      goalOptions: ["Fix posture / pain", "Build strength & muscle", "Lose fat", "Overall fitness"],
      message: "Tell us briefly about yourself (optional)",
      cta: "Send Application",
      sending: "Sending…",
      successMsg: "Application sent! Graciano will get back to you within 24–48h.",
      errorMsg: "Couldn't send — please try again or message us on WhatsApp.",
      or: "or reach out directly",
      whatsapp: "WhatsApp",
      instagram: "Instagram",
    },
    footer: {
      tagline: "From Pain To Performance",
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      disclaimer: "Health Disclaimer",
    },
    notFound: {
      title: "Page Not Found",
      desc: "The page you're looking for doesn't exist or has moved.",
      cta: "Back to Home",
    },
    errorPage: {
      title: "Something Went Wrong",
      desc: "An unexpected error occurred. Please try again.",
      retry: "Try Again",
      home: "Back to Home",
    },
    auth: {
      loginTitle: "Welcome Back",
      loginSub: "Log in to access your programs.",
      registerTitle: "Create Your Account",
      registerSub: "Register to train with Graciano.",
      name: "Full name",
      email: "Email",
      password: "Password",
      login: "Log In",
      register: "Create Account",
      google: "Continue with Google",
      noAccount: "No account yet?",
      haveAccount: "Already have an account?",
      toRegister: "Register",
      toLogin: "Log in",
      checkEmail: "Check your inbox — we sent you a confirmation link.",
      errorGeneric: "Something went wrong. Please try again.",
      errorInvalid: "Wrong email or password.",
      back: "← Back to site",
      consentPre: "I agree to the",
      consentTerms: "Terms of Service",
      consentAnd: "and the",
      consentPrivacy: "Privacy Policy",
      forgot: "Forgot password?",
      forgotTitle: "Reset Password",
      forgotSub: "Enter your email and we'll send you a reset link.",
      sendReset: "Send Reset Link",
      resetSent: "Check your inbox — if that email has an account, a reset link is on its way.",
      resetTitle: "New Password",
      resetSub: "Choose a new password for your account.",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      resetCta: "Update Password",
      resetMismatch: "Passwords don't match.",
      resetDone: "Password updated! Taking you to your programs…",
    },
    dash: {
      title: "My Programs",
      welcome: "Welcome",
      sub: "Everything you've unlocked, in one place.",
      empty: "You don't have any programs yet.",
      emptyCta: "Browse Programs",
      statusActive: "Active",
      statusExpired: "Expired",
      soon: "Program content is coming soon — you'll find it right here.",
      logout: "Log Out",
    },
  },
  sq: {
    nav: { programs: "Programet", coaching: "Coaching", inPerson: "Në Palestër", about: "Rreth Meje", faq: "Pyetje", contact: "Kontakt", cta: "Fillo Tani", login: "Hyr", register: "Regjistrohu", dashboard: "Programet e Mia", logout: "Dil" },
    hero: {
      tag: "Biomekanikë · Posturë · Forcë",
      title1: "Nga Dhimbja",
      title2: "Te Performanca",
      sub: "Stërvitu me qëllim. Lëviz me vetëbesim. Coaching online dhe programe të provuara nga Graciano Dhima — të ndërtuara mbi biomekanikë, jo hamendje.",
      cta1: "Nis Transformimin Tënd",
      cta2: "Shiko Programet",
      scroll: "Shfleto",
    },
    stats: [
      { value: "26K+", label: "Komuniteti" },
      { value: "10+", label: "Vite Përvojë" },
      { value: "500+", label: "Klientë të Stërvitur" },
      { value: "3", label: "Programe Origjinale" },
    ],
    programs: {
      tag: "Stërvitu Kudo",
      title: "Programet",
      sub: "Programe të gatshme nga Graciano. Fillo sot, stërvitu me ritmin tënd.",
      cta: "Merr Programin",
      items: [
        { name: "TRX", desc: "Stërvitje e plotë me rripa TRX. Ndërto forcë, stabilitet dhe kontroll vetëm me një TRX.", badge: "Më i Shituri" },
        { name: "Postura", desc: "Korrigjo shpatullat e rrumbullakosura, liro tensionin në shpinë e qafë, lëviz pa dhimbje.", badge: "Origjinal" },
        { name: "Summer Body", desc: "Digj yndyrën dhe ndërto muskuj të dukshëm me stërvitje progresive të strukturuara.", badge: "" },
      ],
      price: "Blerje një herë · Qasje e menjëhershme",
    },
    coaching: {
      tag: "Puno me Gracianon",
      title: "Coaching Online",
      sub: "Më shumë se një plan stërvitjeje — një trajner në krahun tënd.",
      tiers: [
        {
          name: "Coaching Online",
          featured: true,
          features: ["Plan stërvitjeje i personalizuar", "Udhëzime ushqimore", "Kontrolle javore & përshtatje", "Komunikim direkt në chat", "Ndjekje e progresit"],
          cta: "Apliko Tani",
          note: "Abonim mujor",
        },
        {
          name: "Premium 1:1",
          featured: false,
          features: ["Gjithçka nga Coaching Online", "Programim plotësisht individual", "Analizë video e teknikës", "Video-thirrje 1:1", "Prioritet & kontakt ditor"],
          cta: "Apliko për 1:1",
          note: "Vende të kufizuara",
        },
      ],
    },
    inPerson: {
      tag: "Në Tiranë",
      title: "Stërvitje në Palestër",
      items: [
        { name: "Stërvitje Personale 1:1", desc: "Stërvitu direkt me Gracianon në palestër. Coaching i bazuar në biomekanikë, i përshtatur për trupin tënd." },
        { name: "TRX në Grup", desc: "Grupe të vogla (4–8 persona), dy herë në javë. Përmirëso posturën dhe ndërto forcë nga brenda-jashtë." },
      ],
      cta: "Rezervo në WhatsApp",
    },
    transformations: {
      tag: "Rezultate Reale",
      title: "Transformime",
      sub: "Klientë realë. Progres real.",
      placeholder: "Para / Pas",
    },
    about: {
      tag: "Trajneri",
      title: "Graciano Dhima",
      p1: "Trajner personal dhe specialist TRX me një dekadë përvojë duke ndihmuar njerëzit të kalojnë nga dhimbja te performanca. Metoda ime fillon aty ku shumica e coaching-ut mbaron: biomekanika, postura dhe cilësia e lëvizjes.",
      p2: "Qoftë online, përmes programeve, apo personalisht në Tiranë — çdo plan është personal. Pa shabllone. Pa hamendje.",
      points: ["Trajner Personal i Certifikuar", "Specialist TRX", "Coach i Posturës & Lëvizjes"],
    },
    faq: {
      tag: "Pyetje",
      title: "Pyetje të Shpeshta",
      items: [
        { q: "Jam fillestar i plotë. A mund të filloj?", a: "Po. Çdo plan përshtatet me nivelin tënd — pyetësori fillestar dhe kontrolli i parë sigurojnë që të fillosh saktë aty ku duhet." },
        { q: "A më duhet palestër?", a: "Jo. Programet dhe coaching-u përshtaten me pajisjet e tua — palestër, shtëpi, ose thjesht një rrip TRX." },
        { q: "Si funksionon coaching-u online?", a: "Përmes një aplikacioni: stërvitjet, objektivat ushqimore dhe kontrollet në një vend, me chat direkt me Gracianon." },
        { q: "Po nëse nuk funksionon për mua?", a: "Na shkruaj brenda 14 ditëve të para dhe do ta rregullojmë planin ose gjejmë një zgjidhje bashkë." },
      ],
    },
    lead: {
      title: "Udhëzues Falas Stërvitjeje",
      sub: "Merr udhëzuesin falas të Gracianos dhe fillo të përmirësosh posturën dhe forcën që sot.",
      placeholder: "Email-i yt",
      cta: "Më Dërgo Udhëzuesin",
      note: "Pa spam. Çregjistrohu kur të duash.",
      successMsg: "U regjistrove! Udhëzuesi po vjen në email-in tënd.",
      errorMsg: "Diçka shkoi keq — provo përsëri.",
    },
    contact: {
      tag: "Fillo Tani",
      title: "Gati për Transformim?",
      sub: "Apliko dhe Graciano do të të përgjigjet personalisht.",
      name: "Emri",
      email: "Email",
      goal: "Objektivi yt",
      goalOptions: ["Korrigjim posture / dhimbje", "Forcë & muskuj", "Humbje yndyre", "Formë e përgjithshme"],
      message: "Na trego shkurt për veten (opsionale)",
      cta: "Dërgo Aplikimin",
      sending: "Duke dërguar…",
      successMsg: "Aplikimi u dërgua! Graciano do të të kontaktojë brenda 24–48 orësh.",
      errorMsg: "Nuk u dërgua — provo përsëri ose na shkruaj në WhatsApp.",
      or: "ose na kontakto direkt",
      whatsapp: "WhatsApp",
      instagram: "Instagram",
    },
    footer: {
      tagline: "Nga Dhimbja te Performanca",
      rights: "Të gjitha të drejtat e rezervuara.",
      privacy: "Politika e Privatësisë",
      terms: "Kushtet e Shërbimit",
      disclaimer: "Deklaratë Shëndetësore",
    },
    notFound: {
      title: "Faqja Nuk u Gjet",
      desc: "Faqja që kërkon nuk ekziston ose është zhvendosur.",
      cta: "Kthehu te Faqja",
    },
    errorPage: {
      title: "Diçka Shkoi Keq",
      desc: "Ndodhi një gabim i papritur. Provo përsëri.",
      retry: "Provo Përsëri",
      home: "Kthehu te Faqja",
    },
    auth: {
      loginTitle: "Mirë se u Ktheve",
      loginSub: "Hyr për të parë programet e tua.",
      registerTitle: "Krijo Llogarinë",
      registerSub: "Regjistrohu për t'u stërvitur me Gracianon.",
      name: "Emri i plotë",
      email: "Email",
      password: "Fjalëkalimi",
      login: "Hyr",
      register: "Krijo Llogarinë",
      google: "Vazhdo me Google",
      noAccount: "Nuk ke llogari?",
      haveAccount: "Ke llogari?",
      toRegister: "Regjistrohu",
      toLogin: "Hyr",
      checkEmail: "Kontrollo email-in — të dërguam një link konfirmimi.",
      errorGeneric: "Diçka shkoi keq. Provo përsëri.",
      errorInvalid: "Email ose fjalëkalim i gabuar.",
      back: "← Kthehu te faqja",
      consentPre: "Pranoj",
      consentTerms: "Kushtet e Shërbimit",
      consentAnd: "dhe",
      consentPrivacy: "Politikën e Privatësisë",
      forgot: "Harrove fjalëkalimin?",
      forgotTitle: "Rivendos Fjalëkalimin",
      forgotSub: "Shkruaj email-in dhe do të të dërgojmë një link rivendosjeje.",
      sendReset: "Dërgo Linkun",
      resetSent: "Kontrollo email-in — nëse ai email ka llogari, linku i rivendosjes po vjen.",
      resetTitle: "Fjalëkalim i Ri",
      resetSub: "Zgjidh një fjalëkalim të ri për llogarinë tënde.",
      newPassword: "Fjalëkalimi i ri",
      confirmPassword: "Konfirmo fjalëkalimin e ri",
      resetCta: "Përditëso Fjalëkalimin",
      resetMismatch: "Fjalëkalimet nuk përputhen.",
      resetDone: "Fjalëkalimi u përditësua! Po të çojmë te programet…",
    },
    dash: {
      title: "Programet e Mia",
      welcome: "Mirë se erdhe",
      sub: "Gjithçka që ke blerë, në një vend.",
      empty: "Nuk ke ende asnjë program.",
      emptyCta: "Shiko Programet",
      statusActive: "Aktiv",
      statusExpired: "Skaduar",
      soon: "Përmbajtja e programit vjen së shpejti — do ta gjesh këtu.",
      logout: "Dil",
    },
  },
};

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: any }>({
  lang: "en",
  setLang: () => {},
  t: dict.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // remember language across pages (landing ↔ login ↔ dashboard);
  // must run post-hydration (localStorage is client-only)
  useEffect(() => {
    const saved = window.localStorage.getItem("gd-lang");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "en" || saved === "sq") setLangState(saved);
  }, []);

  // keep <html lang=""> in sync for SEO + screen readers
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("gd-lang", l);
    } catch {}
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
