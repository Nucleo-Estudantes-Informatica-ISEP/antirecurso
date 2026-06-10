'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import ThemeChanger from '@/components/utils/Theme/ThemeChanger';
import useSession from '@/hooks/useSession';
import { cn } from '@/lib/utils';
import { LogIn, LogOut, Menu, User, UserPlus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import swal from 'sweetalert';
import { topBarLinks } from '../Topbar';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  const close = () => setIsOpen(false);

  const handleLogout = async () => {
    close();
    const confirmed = await swal({
      title: 'Tens a certeza que queres terminar sessão?',
      icon: 'warning',
      buttons: ['Não', 'Sim'],
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
        title: 'Terminaste sessão com sucesso!',
        icon: 'success',
        timer: 2000,
        className: theme === 'dark' ? 'swal-dark' : ''
      });
      if (url) {
        window.location.href = url;
        return;
      }
      router.push('/');
      router.refresh();
    } else {
      swal({
        title: 'Algo correu mal. Por favor tenta novamente.',
        icon: 'error',
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    }
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
            aria-label="Abrir menu"
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
                <p className="text-sm font-semibold leading-tight truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {Object.entries(topBarLinks).map(([label, href]) => {
                const isActive =
                  href === '/' ? pathname === '/' : pathname?.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={close}
                      className={cn(
                        'flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        isActive && 'bg-primary/10 text-primary'
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t p-4 space-y-2">
            {session.user ? (
              <>
                <Button asChild variant="default" className="w-full" onClick={close}>
                  <Link href="/profile">
                    <User className="size-4" />
                    Aceder ao perfil
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Terminar sessão
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full" onClick={close}>
                  <Link href="/login">
                    <LogIn className="size-4" />
                    Iniciar sessão
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" onClick={close}>
                  <Link href="/register">
                    <UserPlus className="size-4" />
                    Criar conta
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
