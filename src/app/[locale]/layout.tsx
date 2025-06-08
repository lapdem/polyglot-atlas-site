import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { i18nConfig } from '@/../i18nConfig';
import { dir } from 'i18next';
import initTranslations from '../i18n';
import Script from "next/script";

import "../globals.css";

const inter = Inter({
  subsets: ['latin'],
})

const i18nNamespaces = ['common'];




export function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await initTranslations(locale, i18nNamespaces);

  return {
    metadataBase: new URL('https://polyglotsatlas.com/'),
    title: t("meta.title"),
    description: t("meta.description"),
    authors: [{ name: "Laplace's Demon", url: "https://laplacesdemon.com/" }],
    keywords: t("meta.keywords"),
    alternates: {
      canonical: `https://polyglotsatlas.com/`,
    },
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      locale,
      url: `https://polyglotsatlas.com/${locale}`,
      siteName: t("meta.site_name"),
      type: "website",
      images: [
        {
          url: '/og_image.svg',
          alt: t("meta.image_alt"),
          width: 1200,
          height: 630,
        },
      ],      
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.title"),
      description: t("meta.description"),
      site: "@lapdem",
      creator: "@lapdem",
      images: {url: '/og_image.svg', alt: t("meta.image_alt")},
    },
  };
}

export default async function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale} dir={dir(locale)}>
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
