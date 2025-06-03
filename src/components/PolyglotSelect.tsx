'use client';

import React from 'react';
import Select, { StylesConfig } from 'react-select';
import { useTranslation } from 'react-i18next';
import { useJsonData } from '@/hooks/useJsonData';
import rawColors from 'tailwindcss/colors';

// Extract only colors with shade 500
const tailwindColors = Object.fromEntries(
  Object.entries(rawColors).filter(
    ([, val]) => typeof val === 'object' && val?.[500]
  )
) as Record<string, { [shade: string]: string }>;

type Option = {
  value: string;
  label: string;
};

interface PolyglotSelectProps {
  colors: string[];
  selectedLanguages: string[];
  setSelectedLanguages: (langs: string[]) => void;
}

export default function PolyglotSelect({
  colors,
  selectedLanguages,
  setSelectedLanguages,
}: PolyglotSelectProps) {
  const { t } = useTranslation();
  const { data: optionsRaw, loading, error } = useJsonData<string[]>('/data/language_keys.json');

  const options: Option[] =
    optionsRaw?.map((opt) => ({
      value: opt,
      label: t(`languages:${opt}`, opt),
    })) ?? [];

  const getColor = (index: number): string => {
    const colorName = colors[index % colors.length];
    return tailwindColors[colorName]?.[500] ?? tailwindColors.gray[500];
  };

  const customStyles: StylesConfig<Option, true> = {
  multiValue: (styles, { index }) => ({
    ...styles,
    backgroundColor: getColor(index),
    borderRadius: '0.5rem',
    padding: '0 6px',
    color: 'white',
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: 'white',
    fontWeight: 500,
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: 'white',
    ':hover': {
      backgroundColor: 'rgba(0,0,0,0.2)',
      color: 'white',
    },
  }),
  option: (styles, { isSelected }) => ({
    ...styles,
    ...(isSelected && {
      backgroundColor: '#3b82f6',
      color: 'white',
    }),
    borderRadius: '0.5rem',
    padding: '8px 12px',
  }),
};

  if (loading) return <p className="text-gray-500">{t('loading')}</p>;
  if (error || !optionsRaw) return <p className="text-red-500">{t('error_loading_options')}</p>;

  return (
    <Select
  isMulti
  options={options}
  className="w-full"
  placeholder={t('select_placeholder')}
  styles={customStyles}
  value={selectedLanguages.map(lang => options.find(opt => opt.value === lang)!)}
  onChange={(selected) =>
    setSelectedLanguages(Array.isArray(selected) ? selected.map(opt => opt.value) : [])
  }
  aria-label={t('select_placeholder')} 
/>
  );
}
