import { getLanguage, getMessages, redirect } from '@/i18n/server';
import PendingExamsTable from '@/components/profile/PendingExamsTable';
import PreviousExamsTable from '@/components/exams/PreviousExamsTable';
import UserProfileScoreboard from '@/components/profile/UserProfileScoreboard';
import UserAvatar from '@/components/scoreboard/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getServerSession, getUserScores, getPendingExams } from '@/services/getServerSession';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  History,
  Settings
} from 'lucide-react';
import Link from '@/i18n/navigation';

const Profile: React.FC = async () => {
  const t = await getMessages();
  const lang = await getLanguage();

  const session = await getServerSession();
  if (!session) return redirect('/');

  const { user } = session;

  const userScores = await getUserScores();
  if (!userScores) return redirect('/');

  const pendingExams = await getPendingExams();
  const hasPendingExams = pendingExams?.data && pendingExams.data.length > 0;

  const today = new Date().toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB');

  return (
    <section className="container py-10 md:py-14 w-full max-w-5xl">
      {/* Profile header */}
      <Card className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <CardContent className="relative p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <UserAvatar avatar={user.avatar} />

          <div className="flex-1 text-center md:text-left">
            <Badge variant="soft" className="mb-2">
              {t('copy.your_profile')}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t('copy.welcome')} <span className="text-primary">{user.name}</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-2 text-muted-foreground inline-flex items-center gap-2 text-sm">
              <CalendarDays className="size-4" />
              {t('copy.today_is')} {today}
              {t('copy.any_exams_coming_up')}
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button asChild>
                <Link href="/exams">
                  <GraduationCap className="size-4" />
                  {t('copy.practice_an_exam')}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/notes">
                  <BookOpenCheck className="size-4" />
                  {t('copy.browse_study_notes')}
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                {/* Full navigation required: endpoint redirects outside the Next.js app. */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/api/auth/profile">
                  <Settings className="size-4" />
                  {t('copy.manage_account_on_authnei')}
                </a>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {t('copy.your_name_email_and_picture_are_managed_by_authnei')}
            </p>
          </div>
        </CardContent>
      </Card>

      {(hasPendingExams || userScores.length) && (
        <div className="space-y-10">
          {hasPendingExams && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <History className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold">{t('copy.unfinished_exams')}</h2>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {t('copy.pick_up_where_you_left_off')}
                  </p>
                </div>
              </div>
              <PendingExamsTable />
            </section>
          )}
          {userScores.length && (
            <>
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <GraduationCap className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold">
                      {t('copy.your_score_by_subject')}
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {t('copy.track_your_performance_across_subjects')}
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
                    <h2 className="text-lg md:text-xl font-bold">{t('copy.your_exams')}</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {t('copy.history_of_your_completed_exams')}
                    </p>
                  </div>
                </div>
                <PreviousExamsTable />
              </section>
            </>
          )}
        </div>
      )}

      {!hasPendingExams && !userScores.length && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-10 md:p-14 flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              <GraduationCap className="size-7" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold">
              {t('copy.you_have_not_taken_any_exams_yet')}
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {t('copy.start_practicing_exams_to_track_your_progress_here')}
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/exams">
                {t('copy.practice_exams_2')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default Profile;
