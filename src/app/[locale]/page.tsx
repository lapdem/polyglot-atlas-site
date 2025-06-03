import initTranslations from '../i18n';
import TranslationsProvider from '@/components/TranslationsProvider';

import ClientHome from '@/components/ClientHome';

const i18nNamespaces = ['common', 'languages'];

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      locale={locale}
      namespaces={i18nNamespaces}
      resources={resources}
    >
     <ClientHome />
    </TranslationsProvider>
  );
}