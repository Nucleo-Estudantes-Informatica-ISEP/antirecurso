import { useTranslations as translate, type Lang } from '@/i18n/translations';

// Mode identifiers in API requests remain unchanged; only their labels vary.
export const sanitizeMode = (mode: string, lang: Lang = 'pt'): string => {
  const t = translate(lang);
  switch (mode) {
    case 'all':
      return t('exam.mode.all');
    case 'default':
      return t('exam.mode.default');
    case 'new':
      return t('exam.mode.new');
    case 'realistic':
      return t('exam.mode.realistic');
    case 'wrong':
      return t('exam.mode.wrong');
    case 'hard':
      return t('exam.mode.hard');
    case 'custom':
      return t('exam.mode.custom');
    default:
      return t('exam.mode.default');
  }
};
