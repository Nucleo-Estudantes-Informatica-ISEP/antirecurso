'use client';

import { useLanguage } from '@/i18n/client';
import { localizedPath, withoutLang, useTranslations } from '@/i18n/translations';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ThemeChanger from '@/components/utils/Theme/ThemeChanger';
import useSession from '@/hooks/useSession';
import { switchAuthNeiAccount } from '@/lib/client-auth-actions';
import { cn } from '@/lib/utils';
import { LogIn, LogOut, Menu, RefreshCw, User, UserCog, UserPlus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import swal from 'sweetalert';
import { navigationLinks } from '../navigationLinks';
import LanguageSelect from '../LanguageSelect';
import { APP_PROFILE_LINK, AUTHNEI_ACCOUNT_LINK } from '../profileLinks';

const HamburgerMenu: React.FC = () => {
  const lang = useLanguage();
  const t = useTranslations(lang);
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  const close = () => setIsOpen(false);

  const handleLogout = async () => {
    close();
    const confirmed = await swal({
      title: t('auth.confirmLogout'),
      icon: 'warning',
      buttons: [t('common.no'), t('common.yes')],
      dangerMode: true,
      className: theme === 'dark' ? 'swal-dark' : ''
    });

    if (!confirmed) return;

    const res = await fetch('/api/auth/logout', { method: 'PATCH' });
    if (res.status === 200) {
      const { url } = (await res.json()) as { url?: string };
      await signOut({ redirect: false });
      session.clear();
      swal({
        title: t('auth.loggedOut'),
        icon: 'success',
        timer: 2000,
        className: theme === 'dark' ? 'swal-dark' : ''
      });
      if (url) {
        window.location.href = url;
        return;
      }
      router.push(localizedPath('/', lang));
      router.refresh();
    } else {
      swal({
        title: t('auth.error'),
        icon: 'error',
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    }
  };

  const handleSwitchAccount = async () => {
    close();
    session.clear();
    await switchAuthNeiAccount(pathname || '/');
  };

  const userInitials = session.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <div className="md:hidden flex items-center gap-1">
      <ThemeChanger />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('nav.openMenu')}
            className="text-foreground"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[88vw] max-w-sm flex flex-col gap-0 p-0">
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle className="text-left">
              <span className="text-primary">Anti</span>Recurso
            </SheetTitle>
          </SheetHeader>

          {session.user && (
            <div className="px-6 py-4 flex items-center gap-3 border-b bg-muted/30">
              <Avatar className="size-10">
                <AvatarImage
                  src={`https://gravatar.com/avatar/${session.user.avatar}?s=80&d=identicon`}
                  alt={session.user.name}
                />
                <AvatarFallback className="bg-primary/15 text-primary">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navigationLinks.map(({ key, href }) => {
                const isActive =
                  href === '/'
                    ? withoutLang(pathname) === '/'
                    : withoutLang(pathname).startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={localizedPath(href, lang)}
                      onClick={close}
                      className={cn(
                        'flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        isActive && 'bg-primary/10 text-primary'
                      )}
                    >
                      {t(key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t p-4 space-y-2">
            <LanguageSelect />
            {session.user ? (
              <>
                <Button asChild variant="default" className="w-full" onClick={close}>
                  <Link href={localizedPath(APP_PROFILE_LINK.href, lang)}>
                    <User className="size-4" />
                    {t('auth.profile')}
                  </Link>
                </Button>
                <Separator />
                <Button asChild variant="outline" className="w-full" onClick={close}>
                  <a href={AUTHNEI_ACCOUNT_LINK.href}>
                    <UserCog className="size-4" />
                    {t('auth.manageAccount')}
                  </a>
                </Button>
                <Button variant="outline" className="w-full" onClick={handleSwitchAccount}>
                  <RefreshCw className="size-4" />
                  {t('auth.switchAccount')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  {t('auth.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full" onClick={close}>
                  <Link href={localizedPath('/login', lang)}>
                    <LogIn className="size-4" />
                    {t('auth.login')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" onClick={close}>
                  <Link href={localizedPath('/register', lang)}>
                    <UserPlus className="size-4" />
                    {t('auth.register')}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HamburgerMenu;
