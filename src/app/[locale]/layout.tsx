import type { Metadata } from "next";
import { Inter } from 'next/font/google'

import "../globals.css";

const inter = Inter({
  subsets: ['latin'],
})



export const metadata: Metadata = {
  title: "The Polyglot's Atlas",
  description: "Ever wondered how many people you can talk to in their native language? The Polyglot's Atlas let's you find out!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${inter.className}`}
      >
        {children}
      </body>
    </html>
  );
}
