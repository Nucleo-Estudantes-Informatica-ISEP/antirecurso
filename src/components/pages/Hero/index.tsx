'use client';

import { useMessages } from '@/i18n/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  BookOpenText,
  GraduationCap,
  LineChart,
  ListChecks,
  Sparkles,
  Trophy
} from 'lucide-react';
import Link from '@/i18n/navigation';

import HeroCTA from './HeroCTA';

const Hero: React.FC = () => {
  const t = useMessages();

  const features = [
    {
      icon: ListChecks,
      title: t('copy.practice_exams_3'),
      description: t(
        'copy.practice_exams_for_your_subjects_in_different_modes_random_realistic_new_questions_an'
      ),
      href: '/exams'
    },
    {
      icon: BookOpenText,
      title: t('copy.shared_study_notes'),
      description: t(
        'copy.access_notes_prepared_by_your_classmates_to_help_you_study_for_any_subject'
      ),
      href: '/notes'
    },
    {
      icon: Trophy,
      title: t('copy.competitive_leaderboard'),
      description: t(
        'copy.compete_with_your_classmates_and_climb_the_rankings_for_each_dei_isep_subject'
      ),
      href: '/scoreboard'
    },
    {
      icon: LineChart,
      title: t('copy.personal_statistics'),
      description: t(
        'copy.track_your_progress_question_by_question_with_detailed_charts_and_metrics'
      ),
      href: '/profile'
    }
  ];
  const stats = [
    { value: '+25', label: t('copy.dei_subjects_covered') },
    { value: t('home.questionCount'), label: t('copy.questions_in_the_database') },
    { value: '+100k', label: t('copy.completed_exams_3') }
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none" />

        <div className="container relative flex flex-col items-center text-center pt-20 pb-24 md:pt-28 md:pb-32">
          <Badge variant="soft" className="mb-6 gap-1.5">
            <Sparkles className="size-3.5" />
            {t('copy.an_initiative_by_nei_isep_porto_school_of_engineering')}
          </Badge>

          <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-5xl">
            {t('copy.do_you_really_want_a')}{' '}
            <span className="gradient-text">{t('copy.resit')}</span>?
            <br className="hidden md:block" /> {t('copy.why_when_you_have')}{' '}
            <span className="gradient-text">AntiRecurso</span>.
          </h1>

          <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground text-balance">
            {t('copy.practice_exams_study_with_community_notes_and_track_your_progress')}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Button asChild size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/20">
              <Link href="/exams">
                <GraduationCap className="size-5" />
                {t('copy.practice_exams_2')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
              <Link href="/notes">
                <BookOpenText className="size-5" />
                {t('copy.browse_study_notes')}
              </Link>
            </Button>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-3 gap-4 md:gap-12 w-full max-w-3xl">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center px-2 py-4 rounded-xl border bg-card/40 backdrop-blur-sm"
              >
                <p className="text-2xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-xs md:text-sm text-muted-foreground text-center">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-28">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <Badge variant="outline" className="mb-4">
            {t('copy.everything_you_need')}
          </Badge>
          <h2 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
            {t('copy.study')} <span className="gradient-text">{t('copy.smarter')}</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            {t(
              'copy.a_carefully_designed_platform_to_help_you_avoid_resits_and_pass_every_subject_the_fir'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map(({ icon: Icon, title, description, href }) => (
            <Link key={title} href={href} className="group">
              <Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:bg-accent/30">
                <CardContent className="p-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="size-6" />
                  </div>
                  <CardTitle className="text-lg mb-2">{title}</CardTitle>
                  <CardDescription className="leading-6">{description}</CardDescription>
                  <div className="mt-5 inline-flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    {t('copy.explore')}
                    <ArrowRight className="ml-1.5 size-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <HeroCTA />
    </div>
  );
};

export default Hero;
