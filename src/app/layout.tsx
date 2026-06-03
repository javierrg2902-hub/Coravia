import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coravia 2026 · Escrutinio Electoral",
  description: "Portal oficial de resultados electorales de la República de Coravia — Elecciones Generales 2026",
  openGraph: {
    title: "Coravia 2026 · Escrutinio Electoral",
    description: "Resultados en tiempo real de las Elecciones Generales 2026",
    type: "website",
  },
};

// Content Security Policy vía meta tag.
// LIMITACIÓN: los navegadores solo aplican un subconjunto de directivas CSP desde
// meta tags. En particular, connect-src y frame-ancestors son ignorados por spec
// y requieren cabeceras HTTP (no disponibles en GitHub Pages). Se mantienen en la
// cadena para documentar la intención y para cuando el hosting pueda enviarlas.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* viewport: user-scalable=no omitido intencionalmente — la accesibilidad
            requiere permitir zoom al usuario (WCAG 1.4.4) */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* ── PWA / Instalación en móvil ─────────────────────────────────────── */}
        <link rel="manifest" href="/Coravia/manifest.json" />
        <meta name="theme-color" content="#0a1628" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Coravia 2026" />
        <link rel="apple-touch-icon" href="/Coravia/icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* ── Compartir en redes sociales (WhatsApp, Twitter, Telegram) ─────── */}
        <meta property="og:title" content="Coravia 2026 · Escrutinio Electoral" />
        <meta property="og:description" content="Sigue los resultados en tiempo real de las Elecciones Generales 2026 de Coravia" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Coravia 2026 · Escrutinio" />
        <meta name="twitter:description" content="Resultados en tiempo real — República de Coravia" />

        {/* ── Seguridad ─────────────────────────────────────────────────────── */}
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta
          httpEquiv="Permissions-Policy"
          content="camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
        />
      </head>
      <body className="bg-[#060f1e] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
