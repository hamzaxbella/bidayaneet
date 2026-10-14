import { cookies } from "next/headers";
import { LanguageProvider } from "@/components/LanguageProvider";
import type { Metadata } from "next";
import "./globals.css";
import "./production.css";
import "./original-youth.css";
import "./original-theme.css";
import "./refinement.css";

export const metadata: Metadata = {
  title: "BidayaNeet",
  description:
    "Youth integration monitoring and field mediation platform for Souss-Massa",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale=(await cookies()).get("bidaya-language")?.value === "ar" ? "ar" : "fr";
  return (
    <html lang={locale} dir={locale==="ar"?"rtl":"ltr"}>
      <body><LanguageProvider initialLocale={locale}>{children}</LanguageProvider></body>
    </html>
  );
}
