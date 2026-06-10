import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const Custom403: React.FC = () => {
  return (
    <section className="container py-16 md:py-24 w-full max-w-lg">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <CardContent className="relative p-8 md:p-12 flex flex-col items-center text-center gap-5">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldAlert className="size-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="text-primary">Oops...</span> Acesso negado
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Não tens permissão para aceder a esta página. Inicia sessão ou volta à página inicial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button asChild>
              <Link href="/login">Iniciar sessão</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Página inicial
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Custom403;
