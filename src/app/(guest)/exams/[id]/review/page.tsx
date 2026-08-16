'use client';

import React, { use, useCallback, useEffect } from 'react';

import Image from 'next/image';

import CommentSection from '@/components/comments/CommentSection';
import ExamNumeration from '@/components/exams/ExamNumeration';
import ExamNumerationContainer from '@/components/exams/ExamNumerationContainer';
import QuestionReview from '@/components/exams/QuestionReview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useSession from '@/hooks/useSession';
import { PROTECTED_API_BASE_URL } from '@/services/api';
import { getOwnedExamReviewPath } from '@/services/examReview';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useExamReviewNavigation from 'src/hooks/useExamReviewNavigation';
import { getShuffleSeed, shuffleWithSeed } from '@/utils/examShuffle';
import { useRouter } from 'next/navigation';

interface ExamPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ReviewPage: React.FC<ExamPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const session = useSession();
  const router = useRouter();

  const {
    currentQuestionIndex,
    currentQuestion,
    changeQuestion,
    setExamResult,
    examResult,
    removeEventListener,
    addListener
  } = useExamReviewNavigation();

  const getExamResult = useCallback(async () => {
    const examPath = getOwnedExamReviewPath(resolvedParams.id, session.token);
    if (!examPath) {
      router.replace('/login');
      return;
    }
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`
    };
    const res = await fetch(`${PROTECTED_API_BASE_URL}${examPath}`, {
      method: 'GET',
      headers,
      cache: 'no-cache'
    });

    if (res.ok) {
      const data = await res.json();
      const storedSeed = getShuffleSeed(resolvedParams.id);
      if (storedSeed && data.questions) {
        data.questions = shuffleWithSeed(data.questions, storedSeed);
      }
      setExamResult(data);
    }
  }, [resolvedParams.id, router, setExamResult, session.token]);

  async function submitComment(comment: string) {
    if (!session.user) return;

    await fetch(`${PROTECTED_API_BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`
      },
      body: JSON.stringify({
        comment: comment,
        question_id: currentQuestion?.question.id
      })
    });

    getExamResult();
  }

  useEffect(() => {
    getExamResult();
  }, [getExamResult]);

  const N_SKELETON_QUESTIONS = 10;

  return (
    <section className="w-full">
      <div className="sticky top-16 md:top-[4.5rem] z-20 bg-background/80 backdrop-blur-xl border-b">
        <div className="container py-3 md:py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <Badge variant="soft">Revisão</Badge>
              <h1 className="text-sm md:text-lg font-semibold truncate">
                Exame de{' '}
                <span className="text-primary">
                  {examResult?.subject || (
                    <Skeleton className="inline-block h-5 w-32 align-middle" />
                  )}
                </span>
              </h1>
            </div>
            {examResult && (
              <Badge variant="outline" className="font-bold text-base">
                {Math.round(examResult.score)}%
              </Badge>
            )}
          </div>
        </div>

        {examResult ? (
          <div className="border-t">
            <div className="container flex items-center gap-2 py-2">
              <Button
                size="icon"
                variant="ghost"
                className="size-9 rounded-full shrink-0"
                onClick={() => changeQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                aria-label="Pergunta anterior"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <ExamNumerationContainer>
                {examResult.questions.map((question, i) => (
                  <ExamNumeration
                    key={i}
                    onClick={() => changeQuestion(i)}
                    isWrong={question.is_wrong}
                    active={currentQuestionIndex === i}
                    align={i < 2 ? 'end' : i > examResult.questions.length - 2 ? 'start' : 'center'}
                  >
                    {i + 1}
                  </ExamNumeration>
                ))}
              </ExamNumerationContainer>
              <Button
                size="icon"
                variant="ghost"
                className="size-9 rounded-full shrink-0"
                onClick={() => changeQuestion(currentQuestionIndex + 1)}
                disabled={currentQuestionIndex === examResult.questions.length - 1}
                aria-label="Próxima pergunta"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t">
            <div className="container flex gap-2 py-2 overflow-hidden">
              {Array.from({ length: N_SKELETON_QUESTIONS }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full shrink-0" />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container max-w-4xl py-6 md:py-10">
        {currentQuestion?.question ? (
          <article className="space-y-6">
            <div
              className={`relative w-full overflow-hidden rounded-2xl border bg-muted ${
                currentQuestion.question.image === '' ? 'h-24 md:h-32' : 'h-64 md:h-[24rem]'
              }`}
            >
              {currentQuestion.question.image === '' ? (
                <Image fill alt="Sample" className="object-cover" src="/images/sample.webp" />
              ) : (
                <Image
                  fill
                  alt="Question Image"
                  className="object-contain"
                  src={currentQuestion.question.image}
                />
              )}
            </div>

            <QuestionReview currentQuestion={currentQuestion} />

            <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => changeQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="size-4" />
                Anterior
              </Button>
              <Button
                onClick={() => changeQuestion(currentQuestionIndex + 1)}
                disabled={
                  examResult ? currentQuestionIndex === examResult.questions.length - 1 : true
                }
                className="w-full sm:w-auto"
              >
                Próxima
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </article>
        ) : (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        <div className="mt-10">
          <CommentSection
            comments={examResult?.questions[currentQuestionIndex]?.comments}
            submitComment={submitComment}
            removeEventListener={removeEventListener}
            addListener={addListener}
            questionId={currentQuestion?.question.id}
          />
        </div>
      </div>
    </section>
  );
};

export default ReviewPage;
