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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
