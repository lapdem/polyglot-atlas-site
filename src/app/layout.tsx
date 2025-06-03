import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from 'next/font/google'

import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "The Polyglot's Atlas",
  description: "Ever wondered how many people you can talk to in their native language? The Polyglot's Atlas let's you find out!",
  icons: {
    icon: '/logo.svg', // you can also add PNG fallback here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-N0EWZ11E8B"></Script>
        <Script id ="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-N0EWZ11E8B');
          `}          
        </Script>
      </head>
      <body
        className={`antialiased ${inter.className}`}
      >
        {children}
      </body>
    </html>
  );
}
