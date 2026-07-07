import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BidayaNeet',
  description: 'Youth integration monitoring and field mediation platform for Souss-Massa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: '#F4F6F9', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
