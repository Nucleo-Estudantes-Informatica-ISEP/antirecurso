'use client';

import CustomExamModal from '@/components/exams/CustomExamModal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import useSession from '@/hooks/useSession';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';

interface ExamAnswerPageProps {
  params: Promise<{
    id: string;
  }>;
}

const modes = [
  {
    id: 1,
    name: 'Modo Aleatório',
    description:
      'Resolve um exame com um conjunto aleatório de todas as perguntas que temos disponíveis!',
    slug: 'default',
    icon: '🎲'
  },
  {
    id: 2,
    name: 'Modo Realista',
    description:
      'Desafia-te em condições de exame. Resolve um exame com o número de questões, opções e penalizações aproximadas às do exame real!',
    slug: 'realistic',
    icon: '📝',
    needsAuth: true
  },
  {
    id: 3,
    name: 'Modo Novas Perguntas',
    description:
      'Resolve um exame com perguntas que nunca resolveste antes. Ideal para treinar para o exame!',
    slug: 'new',
    icon: '🆕',
    needsAuth: true
  },
  {
    id: 4,
    name: 'Modo Perguntas Erradas',
    description:
      'Resolve um exame com perguntas que erraste anteriormente. Ideal para perceberes onde tens de melhorar!',
    slug: 'wrong',
    icon: '❌',
    needsAuth: true,
    comingSoon: false
  },
  {
    id: 5,
    name: 'Modo Perguntas Difíceis',
    description: 'Desafia-te com as perguntas mais erradas por todos os estudantes!',
    slug: 'hard',
    icon: '🤯',
    needsAuth: true,
    comingSoon: false
  },
  {
    id: 6,
    name: 'Modo Personalizado',
    description: 'Cria um exame com as características que quiseres!',
    slug: 'custom',
    icon: '⚙️',
    needsAuth: true,
    comingSoon: false
  },
  {
    id: 7,
    name: 'Modo Duelo',
    description: 'Desafia um amigo para descobrir quem acerta mais perguntas!',
    slug: 'duel',
    icon: '👥',
    needsAuth: true,
    comingSoon: true
  }
];

const Exams: React.FC<ExamAnswerPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const { token: session } = useSession();
  const [isCustomExamModalOpen, setIsCustomExamModalOpen] = useState(false);

  return (
    <section className="container py-10 md:py-14 w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <Badge variant="soft" className="mb-3">
          Modos de exame
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          Escolhe o <span className="gradient-text">modo</span> do teu exame
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Treina como mais te ajuda — explora os modos abaixo.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modes.map((mode) => {
          const locked = mode.comingSoon || (mode.needsAuth && !session);
          const card = (
            <Card
              className={cn(
                'group h-full relative overflow-hidden transition-all duration-200',
                !locked &&
                  'hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:bg-accent/30',
                locked && 'opacity-60'
              )}
            >
              <CardContent className="p-6 flex flex-col items-start gap-4 h-full min-h-[14rem]">
                <span className="text-4xl">{mode.icon}</span>
                <div className="flex-1">
                  <p className="text-base md:text-lg font-semibold leading-tight">{mode.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-6">
                    {mode.description}
                  </p>
                </div>
                {mode.comingSoon && (
                  <Badge variant="warning" className="absolute top-3 right-3">
                    Em breve
                  </Badge>
                )}
                {!mode.comingSoon && mode.needsAuth && !session && (
                  <Badge variant="destructive" className="absolute top-3 right-3 gap-1">
                    <Lock className="size-3" /> Conta necessária
                  </Badge>
                )}
              </CardContent>
            </Card>
          );

          if (mode.slug === 'custom') {
            return (
              <div key={mode.id}>
                <button
                  type="button"
                  onClick={() => !locked && setIsCustomExamModalOpen(true)}
                  disabled={locked}
                  className={cn(
                    'block w-full text-left rounded-xl',
                    locked && 'cursor-not-allowed'
                  )}
                >
                  {card}
                </button>
                <CustomExamModal
                  setIsVisible={setIsCustomExamModalOpen}
                  isVisible={isCustomExamModalOpen}
                  title="Personaliza o teu exame"
                  onClose={() => setIsCustomExamModalOpen(false)}
                  params={{ id: Number(resolvedParams.id), mode: mode.slug }}
                />
              </div>
            );
          }

          if (locked) {
            return (
              <div key={mode.id} className="cursor-not-allowed">
                {card}
              </div>
            );
          }

          return (
            <Link
              key={mode.id}
              href={`/exams/${resolvedParams.id}/answer/${mode.slug}`}
              className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {card}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Exams;
