'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
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
            <span className="text-primary">Oops...</span> Algo correu mal
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Aconteceu um erro inesperado. Tenta novamente — se o problema persistir, contacta-nos.
          </p>
          <Button onClick={() => reset()} size="lg">
            <RotateCcw className="size-4" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
