import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/Providers";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cabbie Training | PAT Certificate | Essex",
  description:
    "Accredited Passenger Assistance Training for taxi and private hire drivers across Essex. £75 per person, certificate issued on the day. Accepted by councils across Essex. Call or email to book.",
  keywords: [
    "PAT training",
    "passenger assistance training",
    "taxi driver training",
    "private hire training",
    "Essex",
    "Southend",
    "Rochford",
    "PAT certificate",
  ],
  openGraph: {
    title: "Cabbie Training | PAT Certificate | Essex",
    description:
      "Accredited Passenger Assistance Training for taxi and private hire drivers across Essex. £75 per person, certificate issued on the day.",
    url: "https://cabbietraining.co.uk",
    siteName: "Cabbie Training",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <CookieConsent />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
