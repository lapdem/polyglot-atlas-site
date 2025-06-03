import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18nConfig } from '@/../i18nConfig';
import type {
  i18n as I18nInstance,
  Resource,
  ResourceLanguage,
} from 'i18next';

export default async function initTranslations(
  locale: string,
  namespaces: string[],
  i18nInstance?: I18nInstance,
  resources?: Resource
): Promise<{
  i18n: I18nInstance;
  resources: Record<string, ResourceLanguage>;
  t: I18nInstance['t'];
}> {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`/public/locales/${language}/${namespace}.json`)
      )
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales,
  });

  return {
    i18n: i18nInstance,
    resources: {
      [locale]: i18nInstance.services.resourceStore.data[locale],
    },
    t: i18nInstance.t,
  };
}
