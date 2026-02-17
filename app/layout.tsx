import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";

const parkinsans = localFont({
  src: [
    {
      path: './fonts/Parkinsans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Parkinsans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Parkinsans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Parkinsans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Parkinsans-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-parkinsans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Immersive Auth System",
  description: "Experience the next generation of authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={parkinsans.className}>
        {children}
      </body>
    </html>
  );
}
