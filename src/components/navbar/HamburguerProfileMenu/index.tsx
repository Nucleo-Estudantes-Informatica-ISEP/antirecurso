'use client';

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
import { LogIn, LogOut, RefreshCw, User, UserPlus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';
import { signOutFromApp, switchAuthNeiAccount } from '@/lib/client-auth-actions';

const HamburgerProfileMenu: React.FC = () => {
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
      router.refresh();
    }
  };

  const handleAppLogout = async () => {
    session.clear();
    await signOutFromApp('/');
  };

  const handleSwitchAccount = async () => {
    session.clear();
    await switchAuthNeiAccount(pathname || '/');
  };

  if (!session.user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/login?callbackUrl=${pathname}`}>
            <LogIn className="size-4" />
            Entrar
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href={`/register?callbackUrl=${pathname}`}>
            <UserPlus className="size-4" />
            Criar conta
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
          aria-label="Menu do perfil"
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
          <Link href="/profile" className="cursor-pointer">
            <User className="size-4" />
            <span>O meu perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleAppLogout} className="cursor-pointer">
          <LogOut className="size-4" />
          <span>Sair apenas do AntiRecurso</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSwitchAccount} className="cursor-pointer">
          <RefreshCw className="size-4" />
          <span>Trocar de conta</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span>Terminar sessão no AuthNEI</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HamburgerProfileMenu;
