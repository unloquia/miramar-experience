import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miramar Experience | Naturaleza y Paz",
  description: "Descubre el secreto mejor guardado de la costa atlántica. Playas extensas, bosques encantados y una gastronomía que despierta tus sentidos. La guía definitiva para disfrutar de Miramar, la ciudad de los niños.",
  keywords: ["Miramar", "turismo", "costa atlántica", "Argentina", "playas", "bosques", "gastronomía", "hotelería"],
  authors: [{ name: "Miramar Experience" }],
  openGraph: {
    title: "Miramar Experience | Naturaleza y Paz",
    description: "Descubre el secreto mejor guardado de la costa atlántica.",
    type: "website",
    locale: "es_AR",
    siteName: "Miramar Experience",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miramar Experience",
    description: "Descubre el secreto mejor guardado de la costa atlántica.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Google Fonts - Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Google Material Symbols */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* Leaflet CSS for Maps */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        {children}
        <Toaster position="top-right" richColors />
        <SpeedInsights />
      </body>
    </html>
  );
}
