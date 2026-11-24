'use client';

import { useMessages } from '@/i18n/client';

import { useContext, useEffect, useRef, useState } from 'react';

import Link from '@/i18n/navigation';

import ScoreIndicator from '@/components/profile/ScoreIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useSession from '@/hooks/useSession';
import { ArrowRight, Clock, PartyPopper, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { ExamContext } from '@/contexts/ExamContext';
import { apiRequest } from '@/services/apiClient';
import { getOwnedExamReviewPath } from '@/services/examReview';
import swal from 'sweetalert';

const Points: React.FC = () => {
  const t = useMessages();

  const session = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const { examResult, setExamResult, examTime } = useContext(ExamContext);

  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    async function fetchExamResult() {
      if (examResult) return;
      setLoading(true);
      setFetchError(false);

      try {
        const examId = params?.id;
        const examPath = getOwnedExamReviewPath(
          typeof examId === 'string' ? examId : '',
          session.token
        );
        if (!examPath) {
          setFetchError(true);
          return;
        }
        const data = await apiRequest<{ id: number; score: number; subject: string }>(examPath, {
          authenticated: true,
          method: 'GET',
          cache: 'no-store'
        });
        setExamResult({
          id: data.id,
          score: data.score,
          passed: data.score >= 50,
          subject: data.subject
        });
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchExamResult();
  }, [examResult, setExamResult, session?.token, params?.id]);

  function handleReview() {
    if (!examResult) {
      swal({
        title: t('copy.error_2'),
        text: t('copy.could_not_retrieve_the_exam_result'),
        icon: 'error',
        className: themeRef.current === 'dark' ? 'swal-dark' : ''
      });
      router.push('/');
      return;
    }
    if (!session.token) {
      swal({
        title: t('copy.sign_in'),
        text: t('copy.detailed_review_of_saved_exams_requires_authentication'),
        icon: 'info',
        className: themeRef.current === 'dark' ? 'swal-dark' : ''
      });
      return;
    }
    router.push('/exams/' + examResult.id + '/review');
  }

  if (loading) {
    return (
      <section className="container max-w-3xl py-10 md:py-16 w-full">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
          <CardContent className="relative p-6 md:p-10 flex flex-col items-center text-center">
            <p className="text-muted-foreground">{t('copy.loading_result')}</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (fetchError || !examResult) {
    swal({
      title: t('copy.error_2'),
      text: t('copy.could_not_retrieve_the_exam_result'),
      icon: 'error',
      className: themeRef.current === 'dark' ? 'swal-dark' : ''
    });
    router.push('/');
    return null;
  }

  const minutes = Math.floor(examTime / 60);
  const seconds = examTime % 60;

  return (
    <section className="container max-w-3xl py-10 md:py-16 w-full">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <CardContent className="relative p-6 md:p-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mb-4">
            {examResult.passed ? (
              <PartyPopper className="size-7" />
            ) : (
              <Sparkles className="size-7" />
            )}
          </div>

          <p className="text-sm text-muted-foreground">{t('copy.exam_for')}</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 capitalize">
            {examResult.subject}
          </h1>

          <div className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            {t('copy.time_taken')}{' '}
            <span className="text-primary font-semibold">
              {minutes ? `${minutes}m ` : ''}
              {seconds}s
            </span>
          </div>

          <div className="mt-6 md:mt-8">
            <ScoreIndicator score={examResult.score} />
          </div>

          <div className="mt-8 max-w-md">
            {examResult.passed ? (
              <>
                <p className="text-xl md:text-2xl font-semibold">
                  <span className="gradient-text">{t('copy.congratulations')}</span>{' '}
                  {t('copy.you_passed_the_exam')}
                </p>
                <p className="mt-3 text-sm md:text-base text-muted-foreground">
                  {t('copy.keep_up_the_great_work_you_can_track_your_progress_on_your')}{' '}
                  <Link className="underline text-primary" href="/profile">
                    {t('copy.profile')}
                  </Link>
                  .
                </p>
                <ReactCanvasConfetti
                  onInit={({ confetti }) => {
                    confetti({ particleCount: 150, origin: { y: 0.9 } });
                  }}
                  className="fixed inset-0 z-20 pointer-events-none"
                />
              </>
            ) : (
              <>
                <p className="text-xl md:text-2xl font-semibold">
                  <span className="text-primary">{t('copy.ohhh')}</span>{' '}
                  {t('copy.you_did_not_pass_the_exam')}
                </p>
                <p className="mt-3 text-sm md:text-base text-muted-foreground">
                  {t(
                    'copy.the_lecturers_did_say_theory_classes_mattered_keep_studying_and_practicing_to_improve'
                  )}{' '}
                  <Link className="underline text-primary" href="/profile">
                    {t('copy.profile')}
                  </Link>
                  .
                </p>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button onClick={handleReview} size="lg" className="w-full sm:w-auto">
              {t('copy.review_answers')}
              <ArrowRight className="size-4" />
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/exams">{t('copy.another_exam')}</Link>
            </Button>
          </div>

          {!session.user && (
            <p className="mt-4 text-xs text-muted-foreground">
              {t('copy.create_an_account_to_save_your_progress')}{' '}
              <Link className="underline text-primary" href="/register">
                {t('copy.here')}
              </Link>
              .
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default Points;
