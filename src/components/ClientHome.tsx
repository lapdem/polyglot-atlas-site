'use client';

import React from 'react';
import PolyglotSelect from '@/components/PolyglotSelect';
import PolyglotMap from '@/components/PolyglotMap';
import PolyglotData from '@/components/PolyglotData';
import PolyglotSources from '@/components/PolyglotSources';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Herr_Von_Muellerhoff } from 'next/font/google'

const herr_von_muellerhoff = Herr_Von_Muellerhoff({
  weight: ['400'],
  subsets: ['latin'],
})

export default function ClientHome() {
  const { t } = useTranslation();
  const colors = [
    "blue",
    "red",
    "green",
    "yellow",
    "purple",
    "orange",
    "teal",
    "pink",
    "indigo",
    "lime"
  ];
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  return (
  <div className="min-h-screen flex flex-col">
    {/* Header */}
    <header
className={`w-full bg-gray-800 text-white px-6 text-6xl font-bold flex items-center min-h-[8rem] ${herr_von_muellerhoff.className}`}    >
      <span className="relative top-[0.5rem]">{t("website_title")}</span>
    </header>

    {/* Main content container */}
    <main className="flex-grow w-full flex justify-center">
  <div className="w-full max-w-4xl px-4 py-12 space-y-8">

    {/* Icon and Text */}
    <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 w-full px-4 max-w-screen-md mx-auto">
      <div className="w-full sm:w-1/2 flex justify-center items-center [color-scheme:light]">
        <img src="/logo.svg" alt="Logo" className="w-40 h-auto" />
      </div>
      <div className="w-full sm:w-1/2 flex justify-center sm:justify-start items-center">
        <p className="text-gray-700 text-center sm:text-left">
          {t("website_description")}
        </p>
      </div>
    </div>

    {/* Components */}
    <div>
      <PolyglotSelect
        colors={colors}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
      />
    </div>

    <div>
      <PolyglotMap
        colors={colors}
        selectedLanguages={selectedLanguages}
      />
    </div>

    <div>
      <PolyglotData selectedLanguages={selectedLanguages} />
    </div>

    <div>
      <PolyglotSources />
    </div>

  </div>
</main>

    {/* Footer */}
    <footer className="w-full bg-gray-800 text-white text-center py-4 text-sm">
      <div>
        {t("website_by")}{" "}
        <b>
          <a
            href="https://laplacesdemon.com/"
            className="underline hover:text-gray-300"
          >
            Laplace&apos;s Demon
          </a>
        </b>{" "}
        © {new Date().getFullYear()}
      </div>
      <div className="mt-2 text-gray-400 text-xs px-4">
        <p className="max-w-screen-md mx-auto text-left text-justify">
          {t("disclaimer.line1")} {t("disclaimer.line2")}{" "}
          <a
            href="https://policies.google.com/privacy"
            className="underline hover:text-gray-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("disclaimer.google_privacy_policy")}
          </a>{" "}
          {t("disclaimer.or_use") + " "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            className="underline hover:text-gray-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("disclaimer.opt_out_addon")}
          </a>.
        </p>
      </div>
    </footer>
  </div>
);
}