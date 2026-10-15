'use client';

import { useLanguage } from '@/i18n/client';
import { localizedPath, useTranslations } from '@/i18n/translations';
import LanguageSelect from '../LanguageSelect';
import { navigationLinks } from '../navigationLinks';
import Image from 'next/image';
import Link from '@/i18n/navigation';
import HamburgerMenu from '../HamburgerMenu';
import HamburgerProfileMenu from '../HamburguerProfileMenu';
import TopbarLink from '../TopbarLink';
import ThemeChanger from '@/components/utils/Theme/ThemeChanger';

const Topbar: React.FC = () => {
  const lang = useLanguage();
  const t = useTranslations(lang);
  return (
    <header className="sticky top-0 left-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <nav className="container flex h-16 md:h-[4.5rem] items-center justify-between gap-4">
        <Link
          href={localizedPath('/', lang)}
          className="flex items-center group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-md"
        >
          <Image
            height={160}
            width={160}
            priority
            src="/images/logos/main-logo.svg"
            alt="AntiRecurso"
            className="block dark:hidden max-w-[7rem] md:max-w-[9rem] h-auto"
          />
          <Image
            height={160}
            width={160}
            priority
            src="/images/logos/main-logo-dark.svg"
            alt="AntiRecurso"
            className="hidden dark:block max-w-[7rem] md:max-w-[9rem] h-auto"
          />
        </Link>

        <div className="hidden md:flex md:items-center md:gap-1">
          {navigationLinks.map(({ key, href }) => (
            <TopbarLink key={href} href={href}>
              {t(key)}
            </TopbarLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSelect />
          <ThemeChanger />
          <HamburgerProfileMenu />
        </div>

        <HamburgerMenu />
      </nav>
    </header>
  );
};

export default Topbar;
