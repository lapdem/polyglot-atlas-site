'use client';

import { useJsonData } from '@/hooks/useJsonData';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Source = {
  name: string;
  url: string;
  copyright?: string;
  accessed_on: string;
};

type SourcesJson = {
  populations: Source[];
  languages: Source[];
  map: Source[];
};

export default function PolyglotSources() {
  const { t } = useTranslation();
  const { data: sources, loading, error } = useJsonData<SourcesJson>('/data/sources.json');

  if (loading) return <p>{t('loading')}</p>;
  if (error || !sources) return <p>{t('error_loading_sources')}</p>;

  const formatSources = (label: string, items: Source[]) => {
    if (!items.length) return '';
    const links = items.map((src, i) => (
      <React.Fragment key={`${label}-${i}`}>
        <a href={src.url} target="_blank" rel="noopener noreferrer" >
          {src.name}
        </a>
        {i < items.length - 1 ? ', ' : ''}
      </React.Fragment>
    ));
    return (
      <React.Fragment>
        <strong>{t(`labels.${label}`)}: </strong>
        {links}
        {'\u00A0\u00A0\u00A0'}
      </React.Fragment>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">{t("labels.sources")}</h1>
      <p className="text-justify text-gray-700 leading-relaxed">        
        {formatSources('languages', sources.languages)}
        {formatSources('map', sources.map)}
        {formatSources('populations', sources.populations)}
      </p>
    </div>
  );
}