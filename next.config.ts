import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// Content-Security-Policy
// - 'unsafe-eval' only in dev (Next.js HMR needs it)
// - 'unsafe-inline' required by Next.js inline bootstrap scripts + Tailwind inline styles
// - connect-src allows Supabase (auth + DB)
// - GA4 + Meta Pixel domains allowed (scripts only load after cookie consent)
const buildCsp = (isDev: boolean) =>
  [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://connect.facebook.net`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");

const buildSecurityHeaders = (isDev: boolean) => [
  { key: "Content-Security-Policy", value: buildCsp(isDev) },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: buildSecurityHeaders(isDev),
        },
      ];
    },
  };
};

export default nextConfig;
