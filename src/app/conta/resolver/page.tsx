import { redirect } from '@/i18n/server';

export default async function LegacyAccountResolver() {
  await redirect('/account/resolve');
}
