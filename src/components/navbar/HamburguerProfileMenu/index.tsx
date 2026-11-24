'use client';

import { useLanguage } from '@/i18n/client';
import { localizedPath, useTranslations } from '@/i18n/translations';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import useCallbackUrl from '@/hooks/useCallbackUrl';
import useSession from '@/hooks/useSession';
import { switchAuthNeiAccount } from '@/lib/client-auth-actions';
import { LogIn, LogOut, RefreshCw, User, UserCog, UserPlus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import swal from 'sweetalert';
import { APP_PROFILE_LINK, AUTHNEI_ACCOUNT_LINK } from '../profileLinks';

const HamburgerProfileMenu: React.FC = () => {
  const lang = useLanguage();
  const t = useTranslations(lang);
  const pathname = useCallbackUrl();
  const session = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  const userInitials = session.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  const handleLogout = async () => {
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
      router.refresh();
    }
  };

  const handleSwitchAccount = async () => {
    session.clear();
    await switchAuthNeiAccount(decodeURIComponent(pathname) || localizedPath('/', lang));
  };

  if (!session.user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={localizedPath(`/login?callbackUrl=${pathname}`, lang)}>
            <LogIn className="size-4" />
            {t('auth.enter')}
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href={localizedPath(`/register?callbackUrl=${pathname}`, lang)}>
            <UserPlus className="size-4" />
            {t('auth.register')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full ring-2 ring-transparent hover:ring-primary/40"
          aria-label={t('auth.profile')}
        >
          <Avatar className="size-9">
            <AvatarImage
              src={`https://gravatar.com/avatar/${session.user.avatar}?s=80&d=identicon`}
              alt={session.user.name}
            />
            <AvatarFallback className="bg-primary/15 text-primary">{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={localizedPath(APP_PROFILE_LINK.href, lang)} className="cursor-pointer">
            <User className="size-4" />
            <span>{t('auth.profile')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={AUTHNEI_ACCOUNT_LINK.href} className="cursor-pointer">
            <UserCog className="size-4" />
            <span>{t('auth.manageAccount')}</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSwitchAccount} className="cursor-pointer">
          <RefreshCw className="size-4" />
          <span>{t('auth.switchAccount')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span>{t('auth.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HamburgerProfileMenu;
