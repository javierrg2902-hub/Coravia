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

// Content Security Policy — lista explícita de lo que puede cargar la página.
// 'unsafe-inline' y 'unsafe-eval' en script-src son requeridos por Next.js en
// modo static export para los scripts de hidratación del cliente. Eliminamos
// cualquier otro origen externo para minimizar la superficie de ataque.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",                   // solo puede hacer fetch a /Coravia/data/*.json
  "frame-ancestors 'none'",               // bloquea incrustar la página en iframes (clickjacking)
  "base-uri 'self'",
  "form-action 'none'",                   // no hay formularios que envíen datos
  "object-src 'none'",                    // bloquea Flash/plugins
  "upgrade-insecure-requests",            // fuerza HTTPS en todos los recursos
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* ── Cabeceras de seguridad como meta tags ─────────────────────────────
            GitHub Pages no permite cabeceras HTTP personalizadas, por lo que
            las declaramos aquí. Aunque tienen menos peso que las cabeceras HTTP
            reales, sí son respetadas por los navegadores modernos.
        */}
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
