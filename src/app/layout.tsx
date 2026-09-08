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

const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "A wheelchair user boarding a wheelchair-accessible vehicle via a ramp",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cabbietraining.co.uk"),
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
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cabbie Training | PAT Certificate | Essex",
    description:
      "Accredited Passenger Assistance Training for taxi and private hire drivers across Essex. £75 per person, certificate issued on the day.",
    images: [OG_IMAGE],
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
