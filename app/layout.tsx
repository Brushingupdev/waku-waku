import type { Metadata } from "next";
import "./globals.css";
import "./additional.css";
import "./storefront.css";
import "./catalog-refinement.css";
import "./preventas.css";
import "./preventas-header-polish.css";
import "./preventas-viewer-polish.css";
import "./preventas-panel-polish.css";
import "./catalog-reference.css";
import "./manga-theme.css";
import "./series-carousel.css";
import "./navigation-typography.css";
import "./hero-energy.css";
import "./modal-energy.css";
import "./collector-community.css";
import "./footer-night.css";
import "./preventas-library.css";
import "./how-to-buy.css";
import "./series-gallery.css";
import "./commerce-carousel.css";
import "./loading-motion.css";

export const metadata: Metadata = {
  title: "Waku Waku · Catálogo de figuras",
  description: "Figuras, coleccionables y preventas de Waku Waku.",
  other: {
    "codex-preview": "waku-waku",
  },
  icons: {
    icon: "/illustrations/waku-logo.webp",
    shortcut: "/illustrations/waku-logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head><link rel="preconnect" href="https://tzhzafvmqyanagzrsqlz.supabase.co" crossOrigin="anonymous"/><link rel="dns-prefetch" href="https://tzhzafvmqyanagzrsqlz.supabase.co"/></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
