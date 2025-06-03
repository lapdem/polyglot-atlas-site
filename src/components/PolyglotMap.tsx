'use client';

import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useJsonData } from '@/hooks/useJsonData';
import rawColors from 'tailwindcss/colors';
import PolyglotShare from './PolyglotShare';

interface PolyglotMapProps {
  colors: string[]; // tailwind color names like 'red', 'blue', 'emerald'
  selectedLanguages: string[];
}

type Polygon = [number, number][];
type LanguagePolygons = Record<string, Polygon[]>;

declare global {
  interface Window {
    requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): number;
  }
}

const fallbackGray = 'gray'; // fallback if color not found in tailwind map

const svgPrefix = 'data:image/svg+xml,';

function getTailwindColor(name: string, shade: string): string {
  const color = rawColors[name as keyof typeof rawColors];
  if (typeof color === 'object' && shade in color) {
    return (color as Record<string, string>)[shade];
  }
  return (rawColors[fallbackGray] as Record<string, string>)['300'];
}

function getColorShade(index: number, selected: boolean): string {
  const shades = selected ? ['400', '500', '600'] : ['100', '200', '300'];
  return shades[index % shades.length];
}

function polygonToPoints(polygon: Polygon): string {
  return polygon.map(([x, y]) => `${x},${1080 - y}`).join(' ');
}

export default function PolyglotMap({ colors, selectedLanguages }: PolyglotMapProps): JSX.Element {
  const { t } = useTranslation();
  const { data: languagePolygons, loading, error } = useJsonData<LanguagePolygons>('/data/language_polygons.json');

  const [ready, setReady] = useState<boolean>(false);
  const [svgDataUri, setSvgDataUri] = useState<string>('');
  const [pngReady, setPngReady] = useState<boolean>(false);

  const pngBlobRef = useRef<Blob>(new Blob([], { type: 'image/png' }));

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const generateSvgDataUri: string = useMemo(() => {
    if (!languagePolygons) return '';

    const allLanguages = Object.keys(languagePolygons);
    const orderedLanguages = [
      ...selectedLanguages,
      ...allLanguages.filter((lang) => !selectedLanguages.includes(lang)),
    ];

    const polygonsMarkup: string[] = orderedLanguages.flatMap((lang: string) => {
      const isSelected: boolean = selectedLanguages.includes(lang);
      const colorName: string = isSelected
        ? colors[selectedLanguages.indexOf(lang) % colors.length]
        : fallbackGray;

      return (languagePolygons[lang] || []).map((polygon: Polygon, polyIndex: number) => {
        const shade: string = getColorShade(polyIndex, isSelected);
        const fill: string = getTailwindColor(colorName, shade);
        const points: string = polygonToPoints(polygon);
        return `<polygon points="${points}" fill="${fill}" />`;
      });
    });

    const svgString: string = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
        <rect width="100%" height="100%" fill="white" />
        ${polygonsMarkup.join('\n')}        
      </svg>
    `.trim();

    
    const encoded: string = encodeURIComponent(svgString)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    return svgPrefix + encoded;
  }, [languagePolygons, selectedLanguages, colors]);

  useEffect(() => {
    if (!generateSvgDataUri) return;
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => setSvgDataUri(generateSvgDataUri));
    } else {
      setSvgDataUri(generateSvgDataUri);
    }
  }, [generateSvgDataUri]);

  useEffect(() => {
    if (!svgDataUri) return;

    setPngReady(false);
    const svgText = decodeURIComponent(svgDataUri.slice(svgPrefix.length));

  // Inject your <text> tag just before </svg>
  const injectedText = `
    <text x="80%" y="98%" fill="#374151" font-family="system-ui" font-weight="500" font-size="36">polyglotsatlas.com</text>
  `;

  const modifiedSvgText = svgText.replace('</svg>', `${injectedText}</svg>`);
  const modifiedDataUri = `${svgPrefix}${encodeURIComponent(modifiedSvgText)}`;

    const width = 1920;
    const height = 1080;
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(image, 0, 0, width, height);
        canvas.toBlob((blob: Blob | null) => {
          pngBlobRef.current = blob || new Blob([], { type: 'image/png' });
          setPngReady(true);
        }, 'image/png');
      }
    };

    image.src = modifiedDataUri;
  }, [svgDataUri]);

  if (loading) {
    return (
      <div className="aspect-[16/9] w-full bg-gray-100 flex items-center justify-center text-gray-400">
        {t('loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-[16/9] w-full bg-gray-100 flex items-center justify-center text-red-500">
        {t('map_error')}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[16/9]">
      {!ready || !svgDataUri ? (
        <img
          src="/default_map.svg"
          alt="Default language map"
          className="w-full h-full"
        />
      ) : (
        <img
          src={svgDataUri}
          alt="Language map"
          className="w-full h-full transition-opacity duration-500"
        />
      )}

      {pngReady && (
        <div className="absolute bottom-1 left-1 z-10">
          <PolyglotShare
            imageBlob={pngBlobRef.current}
            text="Check out this map of the languages I speak, made using The Polyglot's Atlas!"
            url="https://polyglotsatlas.com"
          />
        </div>
      )}
    </div>
  );
}

/* snippet for saving the SVG as a file
(() => {
  const svgData = decodeURIComponent(document.querySelector('img[src^="data:image/svg+xml"]').src.split(',')[1]);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'default_map.svg';
  a.click();
})();
*/
