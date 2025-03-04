import { Montserrat, Orbitron } from 'next/font/google';
import { AuthProvider } from '@context/AuthContext';

import '../globals.css';

export const montserrat = Montserrat({
  display: 'swap',
  subsets: ['latin'],
});

export const orbitron = Orbitron({
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} bg-secondary text-white antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
