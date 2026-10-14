import 'server-only';
import { headers } from 'next/headers';
import { defaultLang, isLang, useTranslations as translate } from './translations';

export async function getLanguage() {
  const lang = (await headers()).get('x-app-language');
  return isLang(lang) ? lang : defaultLang;
}

export async function getMessages() {
  return translate(await getLanguage());
}

import { redirect as nextRedirect } from 'next/navigation';
import { localizedPath } from './translations';
export async function redirect(path: string): Promise<never> {
  nextRedirect(localizedPath(path, await getLanguage()));
}
