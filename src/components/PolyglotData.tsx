'use client';

import { useJsonData } from '@/hooks/useJsonData';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// Update the path below if your i18nConfig.ts is in a different location
import { i18nConfig } from '@/../i18nConfig';
import { useCurrentLocale } from 'next-i18n-router/client';

type PolyglotDataProps = {
  selectedLanguages: string[];
};

type LanguageStats = {
  population: number;
  countries: number;
};

type DistributionData = Record<string, Record<string, number>>;

function CircularProgress({ fraction, text, subtext }: { fraction: number, text: string, subtext: string }) {
  const radius = 56;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (fraction) * circumference;

  
  return (
  <div className="flex flex-col items-center space-y-2">
    <svg height={radius * 2} width={radius * 2}>
      {/* Background circle */}
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      {/* Foreground progress circle, rotated individually */}
      <circle
        stroke="#22c55e"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      {/* Centered text (black) */}
      <text
        x="50%"
        y="40%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-gray-700 text-lg font-semibold"
      >
        {text}
      </text>
      {subtext && (
        <text
          x="50%"
          y="60%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-gray-700 text-lg font-semibold"
        >
          {subtext}
        </text>
      )}
    </svg>
  </div>
);


}

export default function PolyglotData({ selectedLanguages }: PolyglotDataProps) {
  const { t } = useTranslation();
  const locale = useCurrentLocale(i18nConfig);
  const population_distribution = useJsonData<Record<string, number>>('/data/population_distribution.json');
  const language_distribution = useJsonData<Record<string, Record<string, number>>>('/data/language_distribution.json');
  const global_population = population_distribution.data
    ? Object.values(population_distribution.data).reduce((acc, val) => acc + val, 0)
    : 1;

  const global_countries = population_distribution.data
    ? Object.keys(population_distribution.data).length
    : 1;


  const statistics = useMemo(() => {
    let total_population = 0;
    let total_countries = 0;
    const language_statistics: Record<string, LanguageStats> = {};

    if (language_distribution.data && population_distribution.data) {
      const langData: DistributionData = language_distribution.data;
      const popData: Record<string, number> = population_distribution.data;

      for (const country in langData) {
        const languages = langData[country];
        const relevant_languages = Object.keys(languages).filter(lang =>
          selectedLanguages.includes(lang)
        );

        if (relevant_languages.length > 0) {
          const total_fraction = Object.values(languages).reduce((acc, val) => acc + val, 0);
          const population = popData[country] ?? 0;

          total_countries += 1;

          for (const lang of relevant_languages) {
            const existing_stat = language_statistics[lang] ?? {
              population: 0,
              countries: 0
            };

            existing_stat.countries += 1;
            existing_stat.population += Math.floor(population * languages[lang]);

            language_statistics[lang] = existing_stat;

            let language_fraction = languages[lang];
            if (relevant_languages.length > 1) {
              language_fraction /= total_fraction;
            }

            total_population += Math.floor(population * language_fraction);
          }
        }
      }
    }

    return { total_population, total_countries, language_statistics };
  }, [selectedLanguages, language_distribution.data, population_distribution.data]);


  
  const population_fraction = statistics.total_population / global_population;
  const population_fraction_quintile = Math.floor(population_fraction * 5);

  return (
    <div className="space-y-6">
      {/* Circular Bars */}
      <div className="flex justify-around items-center">
        <CircularProgress fraction={population_fraction} text={statistics.total_population.toLocaleString(locale, {
          maximumFractionDigits: 2, notation: 'compact',
          compactDisplay: 'short'
        })} subtext={t("labels.people")} />
        <CircularProgress fraction={statistics.total_countries / global_countries} text={statistics.total_countries.toString()} subtext={t("labels.countries")} />
      </div>

      {/* Flow Text */}
      <p className="text-gray-700 leading-relaxed">
        {/*Only display standard data text after countries have been selected*/}

        {population_fraction > 0 ? (
          <>
            {t("data.text1")} {t(`adjectives.good${population_fraction_quintile}`)} {statistics.total_population.toLocaleString(locale, {
              maximumFractionDigits: 2, notation: 'compact',
              compactDisplay: 'short'
            })} {t("data.text2")} {statistics.total_countries.toString()} {t("data.text3")}
          </>
        ) : (
          <>{t("data.not_selected")}</>
        )}
      </p>

      {/* Minimalist Table */}
      <div className="space-y-4">
        {
          Object.entries(statistics.language_statistics)
            .sort(([, a], [, b]) => b.population - a.population)
            .slice(0, 3)

            .map(([name, stats]) => (
              <div
                key={`${name}_stats`}
                className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded border border-gray-200"
              >
                <div className="text-sm text-gray-800">{t(`languages:${name}`, name)}</div>
                <div className="text-sm text-gray-800">{stats.population.toLocaleString(locale, {
                  maximumFractionDigits: 2, notation: 'compact',
                  compactDisplay: 'short'
                })} {t("labels.people")}</div>
                <div className="text-sm text-gray-800">{stats.countries} {t("labels.countries")}</div>
              </div>
            ))}
      </div>
    </div>
  );
}
