import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clockwork Wonderland',
  description: 'A cooperative steampunk card game of mystery and madness',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-950 antialiased">
        {children}
      </body>
    </html>
  );
}
