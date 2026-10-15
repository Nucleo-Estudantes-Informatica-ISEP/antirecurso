import { getMessages } from '@/i18n/server';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getAppAuthSession } from '@/lib/server-auth';
import { fetchSubjects } from '@/services/fetchSubjects';
import { ArrowRight, BookText, Lock, Mail } from 'lucide-react';
import Link from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

const Notes: React.FC = async () => {
  const t = await getMessages();

  const session = await getAppAuthSession();
  const hasSession = Boolean(session?.user);

  const subjects = await fetchSubjects();

  return (
    <section className="container py-10 md:py-14 w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <Badge variant="soft" className="mb-3">
          {t('nav.notes')}
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          {t('copy.choose_a')} <span className="gradient-text">{t('copy.subject')}</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {t('copy.access_study_notes_shared_by_the_dei_isep_community')}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {subjects.map((subject) => {
          const card = (
            <Card
              className={cn(
                'h-full relative transition-all duration-200',
                hasSession
                  ? 'group hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:bg-accent/30 cursor-pointer'
                  : 'opacity-60'
              )}
            >
              <CardContent className="p-5 md:p-6 flex flex-col items-start gap-3 h-full">
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors',
                    hasSession && 'group-hover:bg-primary group-hover:text-primary-foreground'
                  )}
                >
                  <BookText className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm md:text-base font-semibold capitalize leading-tight line-clamp-3">
                    {subject.name}
                  </p>
                  <p className="mt-1 text-xs uppercase text-muted-foreground tracking-wide">
                    {subject.slug}
                  </p>
                </div>
                {hasSession ? (
                  <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <Lock className="size-3" /> {t('copy.account_required')}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );

          if (!hasSession) {
            return <div key={subject.id}>{card}</div>;
          }

          return (
            <Link
              key={subject.id}
              href={`/notes/${subject.id}`}
              className="rounded-xl focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            >
              {card}
            </Link>
          );
        })}
      </div>

      <Card className="mt-10 md:mt-14 max-w-3xl mx-auto">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start gap-5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            <Mail className="size-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{t('copy.have_study_notes_to_share')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                'copy.help_your_classmates_prepare_for_exams_email_us_your_notes_and_we_will_take_care_of_t'
              )}
            </p>
            <a
              className="mt-3 inline-flex items-center text-sm font-semibold text-primary hover:underline"
              href="mailto:support.antirecurso@nei-isep.org"
            >
              support.antirecurso@nei-isep.org
              <ArrowRight className="ml-1.5 size-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Notes;
