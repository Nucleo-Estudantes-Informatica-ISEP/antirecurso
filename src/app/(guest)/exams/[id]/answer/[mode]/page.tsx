'use client';

import { use, useContext, useEffect, useState } from 'react';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import swal from 'sweetalert';

import config from '@/config';
import { ExamContext } from '@/contexts/ExamContext';
import { BASE_URL, PROTECTED_API_BASE_URL } from '@/services/api';
import generateExam from '@/services/generateExam';
import getSubjectNameById from '@/utils/getSubjectNameById';

import ExamNumeration from '@/components/exams/ExamNumeration';
import ExamNumerationContainer from '@/components/exams/ExamNumerationContainer';
import QuestionPrompt from '@/components/exams/QuestionPrompt';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useAnswerableExamNavigation from '@/hooks/useAnswerableExamNavigation';
import useSession from '@/hooks/useSession';
import { ChevronLeft, ChevronRight, Clock, Loader2 } from 'lucide-react';
import sampleImage from 'public/images/sample.webp';

interface ExamPageProps {
  params: Promise<{
    id: string;
    mode: string;
  }>;
}

const N_SKELETON_QUESTIONS = 10;

const Exam: React.FC<ExamPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const nOfQuestions = searchParams.get('n_of_questions');
  const penalizingFactor = searchParams.get('penalizing_factor');
  const filter = searchParams.get('filter');

  const [subject, setSubject] = useState('');

  const session = useSession();
  const { theme } = useTheme();

  const { setExamResult, examTime, setExamTime } = useContext(ExamContext);
  const {
    answers,
    submit,
    setQuestions,
    questions,
    wasAnswered,
    currentQuestionIndex,
    changeQuestion,
    removeEventListener,
    currentQuestion,
    selectAnswer,
    isSubmitting
  } = useAnswerableExamNavigation({ handleConfirm });

  async function handleConfirm() {
    if (isSubmitting) return;

    removeEventListener();

    const data = {
      subject_id: Number.parseInt(resolvedParams.id, 10),
      answers: [...Array.from({ length: questions.length }, (_, i) => i)].map((i) => ({
        question_id: questions[i].id,
        selected_option: answers.get(i) || null
      })),
      time: examTime
    };

    const publicUrl =
      resolvedParams.mode === 'custom' && nOfQuestions && penalizingFactor
        ? `${BASE_URL}/exams/verify?mode=${resolvedParams.mode}&n_of_questions=${nOfQuestions}&penalizing_factor=${penalizingFactor}`
        : `${BASE_URL}/exams/verify?mode=${resolvedParams.mode}`;

    const protectedUrl =
      resolvedParams.mode === 'custom' && nOfQuestions && penalizingFactor
        ? `${PROTECTED_API_BASE_URL}/exams/verify?mode=${resolvedParams.mode}&n_of_questions=${nOfQuestions}&penalizing_factor=${penalizingFactor}`
        : `${PROTECTED_API_BASE_URL}/exams/verify?mode=${resolvedParams.mode}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (config.mandatoryAuthModes.includes(resolvedParams.mode)) {
      headers.Authorization = `Bearer ${session.token}`;
    }

    const res = await fetch(
      config.mandatoryAuthModes.includes(resolvedParams.mode) ? protectedUrl : publicUrl,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      }
    );

    if (res.status === 200) {
      setExamResult(await res.json());
      router.push(`/exams/${resolvedParams.id}/points`);
    } else {
      swal('Ocorreu um erro ao submeter o exame.', 'Por favor tente novamente.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    }
  }

  useEffect(() => {
    async function getExam(id: number, mode: string, n_of_questions?: number, filter?: string) {
      try {
        const exam = await generateExam(id, mode, session.token, n_of_questions, filter);
        if (exam === null) {
          swal('Ocorreu um erro ao carregar o exame.', 'Por favor tente novamente.', 'error', {
            className: theme === 'dark' ? 'swal-dark' : ''
          });
          router.push('/exams');
          return;
        }
        setQuestions(exam);
      } catch {
        swal('Error', 'Por favor tente novamente.', 'error', {
          className: theme === 'dark' ? 'swal-dark' : ''
        });
      }
    }

    async function setSubjectName() {
      setSubject(await getSubjectNameById(Number.parseInt(resolvedParams.id, 10)));
    }

    if (nOfQuestions !== undefined && nOfQuestions !== null)
      getExam(
        Number.parseInt(resolvedParams.id, 10),
        resolvedParams.mode,
        Number.parseInt(nOfQuestions, 10),
        filter ?? undefined
      );
    else getExam(Number.parseInt(resolvedParams.id, 10), resolvedParams.mode);

    setExamTime(0);
    setSubjectName();
  }, [resolvedParams.id, resolvedParams.mode, router, setQuestions, session.token, nOfQuestions, filter, setExamTime, theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setExamTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [setExamTime]);

  const minutes = Math.floor(examTime / 60);
  const seconds = examTime % 60;

  const totalAnswered = answers.size;
  const totalQuestions = questions.length || 1;
  const progress = (totalAnswered / totalQuestions) * 100;

  return (
    <section className="w-full">
      {/* Sticky header */}
      <div className="sticky top-16 md:top-[4.5rem] z-20 bg-background/80 backdrop-blur-xl border-b">
        <div className="container py-3 md:py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <Badge variant="soft" className="capitalize">
                {resolvedParams.mode}
              </Badge>
              <h1 className="text-sm md:text-lg font-semibold truncate">
                Exame de{' '}
                <span className="text-primary">
                  {subject || <Skeleton className="inline-block h-5 w-32 align-middle" />}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold tabular-nums">
              <Clock className="size-4 text-muted-foreground" />
              <span>
                {minutes.toString().padStart(2, '0')}:
                {seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {questions[0] && (
            <div className="flex items-center justify-between text-xs text-muted-foreground gap-3">
              <span>
                {totalAnswered} / {questions.length} respondidas
              </span>
              <div className="flex-1 h-1.5 max-w-md rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-brand-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="whitespace-nowrap">
                Pergunta {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
          )}
        </div>

        {/* Question Numeration */}
        {questions[0] ? (
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
                {questions.map((question, i) => (
                  <ExamNumeration
                    key={question.id}
                    onClick={() => changeQuestion(i)}
                    wasAnswered={wasAnswered(i)}
                    active={currentQuestionIndex === i}
                    align={i < 2 ? 'end' : i > questions.length - 2 ? 'start' : 'center'}
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
                disabled={currentQuestionIndex === questions.length - 1}
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
        {currentQuestion ? (
          <article className="space-y-6">
            <div
              className={`relative w-full overflow-hidden rounded-2xl border bg-muted ${
                currentQuestion.image === '' ? 'h-24 md:h-32' : 'h-64 md:h-[24rem]'
              }`}
            >
              {currentQuestion.image === '' ? (
                <Image fill alt="Sample" className="object-cover" src={sampleImage} />
              ) : (
                <Image
                  fill
                  alt="Question Image"
                  className="object-contain"
                  src={currentQuestion.image}
                />
              )}
            </div>

            <QuestionPrompt
              currentQuestion={currentQuestion}
              selectAnswer={selectAnswer}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
            />

            {/* Bottom controls */}
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

              {currentQuestionIndex === questions.length - 1 ? (
                <form onSubmit={(e) => submit(e)} className="w-full sm:w-auto">
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        A submeter...
                      </>
                    ) : (
                      'Terminar exame'
                    )}
                  </Button>
                </form>
              ) : (
                <Button
                  onClick={() => changeQuestion(currentQuestionIndex + 1)}
                  className="w-full sm:w-auto"
                >
                  Próxima
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          </article>
        ) : (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Exam;
