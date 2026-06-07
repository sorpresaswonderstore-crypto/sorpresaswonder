import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SorpresasWonderStore — Bisutería & Accesorios Elegantes",
  description:
    "Descubre nuestra exclusiva colección de bisutería y accesorios modernos para dama y caballero. Calidad y elegancia en cada pieza.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
  },
  keywords: [
    "bisutería",
    "accesorios",
    "joyería",
    "elegante",
    "dama",
    "caballero",
    "Venezuela",
    "collares",
    "pulseras",
    "argollas",
  ],
  authors: [{ name: "SorpresasWonderStore" }],
  openGraph: {
    title: "SorpresasWonderStore — Bisutería & Accesorios Elegantes",
    description: "Bisutería y accesorios elegantes para dama y caballero. Piezas únicas que cuentan tu estilo.",
    type: "website",
    locale: "es_VE",
    siteName: "SorpresasWonderStore",
  },
  twitter: {
    card: "summary_large_image",
    title: "SorpresasWonderStore",
    description: "Bisutería y accesorios elegantes para dama y caballero",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
