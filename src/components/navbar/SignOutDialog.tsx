'use client';

import { ArrowRight, LogOut, ShieldCheck } from 'lucide-react';
import { useRef, useState, type RefObject } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import useAuthNeiSignOut from '@/hooks/useAuthNeiSignOut';
import { useMessages } from '@/i18n/client';

type SignOutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export default function SignOutDialog({ open, onOpenChange, triggerRef }: SignOutDialogProps) {
  const t = useMessages();
  const signOut = useAuthNeiSignOut();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<Awaited<ReturnType<typeof signOut>>>();

  function changeOpen(nextOpen: boolean) {
    if (pending) return;
    setError(undefined);
    onOpenChange(nextOpen);
  }

  async function submit(scope: 'app' | 'shared') {
    setError(undefined);
    setPending(true);
    try {
      const failure = await signOut(scope);
      if (failure) setError(failure);
      else onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  const optionClass =
    'h-auto w-full justify-start gap-3 rounded-xl px-3 py-3 text-left whitespace-normal sm:px-4';

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-md max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto overscroll-contain rounded-2xl p-5 sm:p-6 [&>button]:hidden motion-reduce:animate-none"
        aria-busy={pending}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          cancelRef.current?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          triggerRef.current?.focus();
        }}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl tracking-tight">{t('auth.logout')}</DialogTitle>
          <DialogDescription>{t('auth.signOutScope')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2.5">
          <Button
            type="button"
            variant="outline"
            className={optionClass}
            disabled={pending}
            onClick={() => submit('app')}
          >
            <LogOut aria-hidden="true" className="text-primary" />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{t('auth.signOutApp')}</span>
              <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                {t('auth.signOutAppDescription')}
              </span>
            </span>
            <ArrowRight aria-hidden="true" className="text-muted-foreground" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className={optionClass}
            disabled={pending}
            onClick={() => submit('shared')}
          >
            <ShieldCheck aria-hidden="true" className="text-primary" />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{t('auth.signOutShared')}</span>
              <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                {t('auth.signOutSharedDescription')}
              </span>
            </span>
            <ArrowRight aria-hidden="true" className="text-muted-foreground" />
          </Button>
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {t(error)}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 border-t pt-3">
          <p className="mr-auto text-xs leading-5 text-muted-foreground">
            {t('auth.signOutOtherApps')}
          </p>
          <DialogClose asChild>
            <Button ref={cancelRef} type="button" variant="ghost" disabled={pending}>
              {t('copy.cancel')}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
