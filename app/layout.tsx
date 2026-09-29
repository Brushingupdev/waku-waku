import type { Metadata } from "next";
import "./globals.css";
import "./additional.css";

export const metadata: Metadata = {
  title: "Waku Waku · Catálogo de figuras",
  description: "Figuras, coleccionables y preventas de Waku Waku.",
  other: {
    "codex-preview": "waku-waku",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
