import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Alloy — Forged with Alloy",
    template: "%s — Alloy",
  },
  description:
    "A from-scratch Minecraft modding ecosystem. New mod loader, modding API, mappings pipeline, modpack format, and launcher — built to make the old guard obsolete.",
  metadataBase: new URL("https://alloymc.net"),
  openGraph: {
    title: {
      default: "Alloy — Forged with Alloy",
      template: "%s — Alloy",
    },
    description:
      "A from-scratch Minecraft modding ecosystem built for the future.",
    url: "https://alloymc.net",
    siteName: "Alloy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: {
      default: "Alloy — Forged with Alloy",
      template: "%s — Alloy",
    },
    description:
      "A from-scratch Minecraft modding ecosystem built for the future.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <a href="#main-content" className="skip-nav">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
