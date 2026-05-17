import type { Metadata } from "next";
import { Figtree, Lora } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Darse Quran Academy | Online Islamic Learning",
    template: "%s | Darse Quran Academy",
  },
  description:
    "Learn Quran, Tajweed, Arabic, and Islamic studies online with qualified teachers at Darse Quran Academy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${lora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col overflow-x-hidden font-sans"
        suppressHydrationWarning
      >
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </SessionProvider>
      </body>
    </html>
  );
}
