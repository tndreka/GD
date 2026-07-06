"use client";

import { LangProvider } from "@/lib/i18n";
import AuthCard from "@/components/AuthCard";

export default function LoginPage() {
  return (
    <LangProvider>
      <AuthCard mode="login" />
    </LangProvider>
  );
}
