import { useConfig } from '@/store/useConfig';
import { en } from '@/locales/en';
import { pt } from '@/locales/pt';

export const useTranslations = () => {
  const { global } = useConfig();
  return global.locale === 'pt' ? pt : en;
};

export const useI18n = () => {
  const { global, setGlobal } = useConfig();
  const t = useTranslations();

  const toggleLocale = () => {
    setGlobal({ locale: global.locale === 'pt' ? 'en' : 'pt' });
  };

  return { t, locale: global.locale, toggleLocale };
};
