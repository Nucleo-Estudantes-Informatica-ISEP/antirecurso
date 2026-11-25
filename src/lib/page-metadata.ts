import 'server-only';
import type { Metadata } from 'next';
import { getLanguage, getMessages } from '@/i18n/server';
import type { TranslationKey } from '@/i18n/translations';
import { buildMetadata } from './seo';

/** Localized title/description/canonical/hreflang/social metadata for a public page. */
export async function pageMetadata(
  path: string,
  titleKey: TranslationKey,
  descriptionKey: TranslationKey
): Promise<Metadata> {
  const [lang, t] = await Promise.all([getLanguage(), getMessages()]);
  const meta = buildMetadata({ lang, path, title: t(titleKey), description: t(descriptionKey) });
  // The home title already carries the brand, so it bypasses the layout title template.
  return path === '/' ? { ...meta, title: { absolute: t(titleKey) } } : meta;
}
