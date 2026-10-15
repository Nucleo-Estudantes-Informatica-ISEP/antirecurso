'use client';

import { useMessages } from '@/i18n/client';

import { ArrowRight } from 'lucide-react';
import Link from '@/i18n/navigation';

import { Button } from '@/components/ui/button';
import useSession from '@/hooks/useSession';

const HeroCTA: React.FC = () => {
  const t = useMessages();

  const { user, isLoading } = useSession();

  //test fakeUser
  //const fakeUser = { id: 1, name: 'Test', email: 'a@a.com', is_admin: 0, avatar: '', scores: [], answers: [] };

  if (isLoading) return null;

  return (
    <section className="container pb-24">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary via-brand-500 to-brand-700 px-6 py-12 md:px-14 md:py-16 text-center text-white shadow-xl shadow-primary/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="relative">
          {user ? (
            <>
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-balance">
                {t('copy.ready_for_your_next_exam')}
              </h3>
              <p className="mt-3 max-w-xl mx-auto text-white/80 text-balance">
                {t('copy.keep_studying_and_climb_your_subject_s_leaderboard')}
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 shadow-md"
                >
                  <Link href="/exams">
                    {t('copy.practice_exams_2')}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/profile">{t('copy.view_profile')}</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-balance">
                {t('copy.ready_to_leave_resits_behind')}
              </h3>
              <p className="mt-3 max-w-xl mx-auto text-white/80 text-balance">
                {t('copy.create_your_free_account_and_start_studying_with_the_dei_isep_community')}
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 shadow-md"
                >
                  <Link href="/register">
                    {t('copy.get_started')}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/about">{t('copy.learn_more')}</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroCTA;
