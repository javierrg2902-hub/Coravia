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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#060f1e] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
