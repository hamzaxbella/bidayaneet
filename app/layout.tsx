import type { Metadata } from "next";
import "./globals.css";
import "./production.css";
import "./original-youth.css";
import "./original-theme.css";
import "./refinement.css";
import "./run-1.css";
import "./auth-refactor.css";
import "./partner-refactor.css";
import "./youth-refactor.css";

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
    <html lang="fr" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
