import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./production.css";

const dmSans = localFont({
  src: "../public/fonts/dm-sans-variable.ttf",
  variable: "--font-ui",
  display: "swap",
  weight: "100 1000",
});

export const metadata: Metadata = {
  title: "BidayaNeet",
  description:
    "Youth integration monitoring and field mediation platform for Souss-Massa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  );
}
