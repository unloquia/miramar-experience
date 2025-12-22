import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { ChatWidget } from "@/components/chat/ChatWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "soydeMiramar | Naturaleza y Paz",
  description: "Descubre el secreto mejor guardado de la costa atlántica. La guía definitiva para disfrutar de Miramar, la ciudad de los niños.",
  keywords: ["Miramar", "soydeMiramar", "turismo", "costa atlántica", "Argentina", "playas", "gastronomía"],
  authors: [{ name: "soydeMiramar" }],
  icons: {
    icon: "/images/dbf5bcf1-ba8f-4801-9e6f-533bacca3a23.jpg",
    apple: "/images/dbf5bcf1-ba8f-4801-9e6f-533bacca3a23.jpg",
  },
  openGraph: {
    title: "soydeMiramar | Naturaleza y Paz",
    description: "Descubre el secreto mejor guardado de la costa atlántica.",
    type: "website",
    locale: "es_AR",
    siteName: "soydeMiramar",
    images: [
      {
        url: "/images/dbf5bcf1-ba8f-4801-9e6f-533bacca3a23.jpg",
        width: 800,
        height: 600,
        alt: "Logo soydeMiramar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "soydeMiramar",
    description: "Descubre el secreto mejor guardado de la costa atlántica.",
    images: ["/images/dbf5bcf1-ba8f-4801-9e6f-533bacca3a23.jpg"],
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
        <ChatWidget
          token={process.env.NEXT_PUBLIC_CHAT_TOKEN || "CLT-jgd-XN8CapPKU3oTrpoXkw-CLzKgVRhz5aUO8_babJKLw"}
          primaryColor="#0f172a"
          botName="Asistente Miramar"
        />
      </body>
    </html>
  );
}
