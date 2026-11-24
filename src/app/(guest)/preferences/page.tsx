import LanguageSelect from '@/components/navbar/LanguageSelect';
import AccountDataSettings from '@/components/profile/AccountDataSettings';
import { Card, CardContent } from '@/components/ui/card';
import ThemeChanger from '@/components/utils/Theme/ThemeChanger';
import { getMessages } from '@/i18n/server';

export default async function PreferencesPage() {
  const t = await getMessages();

  return (
    <section className="container mx-auto w-full max-w-xl py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{t('auth.appPreferences')}</h1>
      <Card>
        <CardContent className="divide-y px-6 py-2">
          <div className="flex items-center justify-between gap-4 py-3">
            <span>{t('languageSwitcher.label')}</span>
            <LanguageSelect />
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <span>{t('preferences.theme')}</span>
            <ThemeChanger />
          </div>
        </CardContent>
      </Card>
      <AccountDataSettings />
    </section>
  );
}
