import PendingExamsTable from '@/components/profile/PendingExamsTable';
import PreviousExamsTable from '@/components/exams/PreviousExamsTable';
import UserProfileScoreboard from '@/components/profile/UserProfileScoreboard';
import UserAvatar from '@/components/scoreboard/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getServerSession, getUserScores, getPendingExams } from '@/services/getServerSession';
import { ArrowRight, BookOpenCheck, CalendarDays, GraduationCap, History, Settings } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Profile: React.FC = async () => {
  const session = await getServerSession();
  if (!session) redirect('/');

  const { user } = session;

  const userScores = await getUserScores();
  if (!userScores) redirect('/');

  const pendingExams = await getPendingExams();
  const hasPendingExams = pendingExams?.data && pendingExams.data.length > 0;

  const today = new Date().toLocaleDateString('pt-PT');

  return (
    <section className="container py-10 md:py-14 w-full max-w-5xl">
      {/* Profile header */}
      <Card className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <CardContent className="relative p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <UserAvatar avatar={user.avatar} />

          <div className="flex-1 text-center md:text-left">
            <Badge variant="soft" className="mb-2">
              O teu perfil
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Boas vindas, <span className="text-primary">{user.name}</span>
            </h1>
            <p className="mt-2 text-muted-foreground inline-flex items-center gap-2 text-sm">
              <CalendarDays className="size-4" />
              Hoje é dia {today}. Tens algum exame perto?
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button asChild>
                <Link href="/exams">
                  <GraduationCap className="size-4" />
                  Resolver exame
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/notes">
                  <BookOpenCheck className="size-4" />
                  Ver resumos
                </Link>
              </Button>
              {process.env.AUTH_ISSUER_URL && (
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <a
                    href={`${process.env.AUTH_ISSUER_URL}/ui/console`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Settings className="size-4" />
                    Gerir conta
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {hasPendingExams && (
        <section className="space-y-10 mb-10">
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <History className="size-5" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">Exames por terminar</h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Continua onde paraste
                </p>
              </div>
            </div>
            <PendingExamsTable />
          </section>
        </section>
      )}

      {userScores.length ? (
        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="size-5" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">O teu score por disciplina</h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Acompanha o teu desempenho ao longo das cadeiras
                </p>
              </div>
            </div>
            <UserProfileScoreboard userScores={userScores} />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <History className="size-5" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">Os teus exames</h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Histórico dos exames que já realizaste
                </p>
              </div>
            </div>
            <PreviousExamsTable />
          </section>
        </div>
      ) : !hasPendingExams ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-10 md:p-14 flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              <GraduationCap className="size-7" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold">Ainda não realizaste nenhum exame</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Começa já a resolver exames para acompanhares a tua evolução por aqui.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/exams">
                Resolver exames
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
};

export default Profile;
