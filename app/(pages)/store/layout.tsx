import { Montserrat, Orbitron } from 'next/font/google';
import Header from '@components/Header';

import '../../globals.css';

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
    <>
      <Header />
      {children}
    </>
  );
}
