"use client";

import { LangProvider } from "@/lib/i18n";
import AuthCard from "@/components/AuthCard";

export default function RegisterPage() {
  return (
    <LangProvider>
      <AuthCard mode="register" />
    </LangProvider>
  );
}
