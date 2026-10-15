'use client';

import { useMessages } from '@/i18n/client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const t = useMessages();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container py-16 md:py-24 w-full max-w-lg">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <CardContent className="relative p-8 md:p-12 flex flex-col items-center text-center gap-5">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertOctagon className="size-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="text-primary">{t('copy.oops')}</span> {t('copy.something_went_wrong')}
          </h1>
          <p className="text-muted-foreground max-w-sm">
            {t('copy.an_unexpected_error_occurred_try_again_if_the_problem_persists_contact_us')}
          </p>
          <Button onClick={() => reset()} size="lg">
            <RotateCcw className="size-4" />
            {t('copy.try_again')}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
