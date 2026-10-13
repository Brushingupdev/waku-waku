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

export const metadata: Metadata = {
  title: "Waku Waku · Catálogo de figuras",
  description: "Figuras, coleccionables y preventas de Waku Waku.",
  other: {
    "codex-preview": "waku-waku",
  },
  icons: {
    icon: "/illustrations/waku-logo.png",
    shortcut: "/illustrations/waku-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
