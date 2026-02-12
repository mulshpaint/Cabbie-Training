import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cabbie Training | PAT Certificate | Essex",
  description:
    "Accredited Passenger Assistance Training for taxi and private hire drivers across Essex. Get your PAT certificate in just 4 hours. Accepted by 20+ councils.",
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
      "Accredited Passenger Assistance Training for taxi and private hire drivers across Essex. Get your PAT certificate in just 4 hours.",
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
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
