'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TopbarLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const TopbarLink: React.FC<TopbarLinkProps> = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive =
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <Link
      onClick={onClick}
      href={href}
      className={cn(
        'relative px-3 py-2 text-sm font-medium rounded-md transition-colors',
        'text-muted-foreground hover:text-foreground hover:bg-accent/60',
        isActive && 'text-primary hover:text-primary'
      )}
    >
      {children}
      {isActive && (
        <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
      )}
    </Link>
  );
};

export default TopbarLink;
