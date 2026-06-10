import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { fetchSubjectsWithQuestions } from '@/services/fetchSubjects';
import { ArrowRight, Trophy } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const Scoreboard: React.FC = async () => {
  const subjects = await fetchSubjectsWithQuestions();

  return (
    <section className="container py-10 md:py-14 w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <Badge variant="soft" className="mb-3">
          Scoreboard
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          Escolhe uma <span className="gradient-text">disciplina</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Vê quem está no topo em cada cadeira do DEI-ISEP.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/scoreboard/${subject.id}`}
            className="group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:bg-accent/30">
              <CardContent className="p-5 md:p-6 flex flex-col items-start gap-3 h-full">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Trophy className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm md:text-base font-semibold capitalize leading-tight line-clamp-3">
                    {subject.name}
                  </p>
                  <p className="mt-1 text-xs uppercase text-muted-foreground tracking-wide">
                    {subject.slug}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Scoreboard;
