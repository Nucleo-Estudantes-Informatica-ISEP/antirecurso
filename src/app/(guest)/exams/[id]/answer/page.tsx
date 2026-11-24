'use client';

import { useMessages } from '@/i18n/client';

import CustomExamModal from '@/components/exams/CustomExamModal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import useSession from '@/hooks/useSession';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import Link from '@/i18n/navigation';
import { use, useState } from 'react';

interface ExamAnswerPageProps {
  params: Promise<{
    id: string;
  }>;
}

const Exams: React.FC<ExamAnswerPageProps> = ({ params }) => {
  const t = useMessages();

  const modes = [
    {
      id: 1,
      name: t('copy.random_mode'),
      description: t('copy.take_an_exam_with_a_random_selection_from_all_available_questions'),
      slug: 'default',
      icon: '🎲'
    },
    {
      id: 2,
      name: t('copy.realistic_mode'),
      description: t(
        'copy.challenge_yourself_under_exam_conditions_with_a_number_of_questions_options_and_penal'
      ),
      slug: 'realistic',
      icon: '📝'
    },
    {
      id: 3,
      name: t('copy.new_questions_mode'),
      description: t(
        'copy.take_an_exam_with_questions_you_have_never_answered_before_ideal_for_exam_practice'
      ),
      slug: 'new',
      icon: '🆕'
    },
    {
      id: 4,
      name: t('copy.wrong_answers_mode'),
      description: t(
        'copy.take_an_exam_with_questions_you_previously_got_wrong_find_out_where_you_need_to_impro'
      ),
      slug: 'wrong',
      icon: '❌',
      comingSoon: false
    },
    {
      id: 5,
      name: t('copy.difficult_questions_mode'),
      description: t('copy.challenge_yourself_with_the_questions_students_get_wrong_most_often'),
      slug: 'hard',
      icon: '🤯',
      comingSoon: false
    },
    {
      id: 6,
      name: t('copy.custom_mode'),
      description: t('copy.create_an_exam_with_your_own_settings'),
      slug: 'custom',
      icon: '⚙️',
      comingSoon: false
    },
    {
      id: 7,
      name: t('copy.duel_mode'),
      description: t('copy.challenge_a_friend_to_see_who_answers_more_questions_correctly'),
      slug: 'duel',
      icon: '👥',
      comingSoon: true
    }
  ];

  const resolvedParams = use(params);
  const { token: session } = useSession();
  const [isCustomExamModalOpen, setIsCustomExamModalOpen] = useState(false);

  return (
    <section className="container py-10 md:py-14 w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <Badge variant="soft" className="mb-3">
          {t('copy.exam_modes')}
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          {t('copy.choose_the')} <span className="gradient-text">{t('copy.mode')}</span>{' '}
          {t('copy.for_your_exam')}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {t('copy.practice_your_way_explore_the_modes_below')}
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modes.map((mode) => {
          const needsAuth = config.mandatoryAuthModes.includes(mode.slug);
          const locked = mode.comingSoon || (needsAuth && !session);
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
                  <p className="mt-2 text-sm text-muted-foreground leading-6">{mode.description}</p>
                </div>
                {mode.comingSoon && (
                  <Badge variant="warning" className="absolute top-3 right-3">
                    {t('copy.coming_soon')}
                  </Badge>
                )}
                {!mode.comingSoon && needsAuth && !session && (
                  <Badge variant="destructive" className="absolute top-3 right-3 gap-1">
                    <Lock className="size-3" /> {t('copy.account_required')}
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
                  title={t('copy.customize_your_exam')}
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
              className="block rounded-xl focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
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
