'use client';

import { use, useContext, useEffect, useRef, useState } from 'react';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import swal from 'sweetalert';

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
import {
  getShuffleSeed,
  setShuffleSeed,
  shuffleWithSeed,
} from '@/utils/examShuffle';

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
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const { setExamResult, examTime, setExamTime } = useContext(ExamContext);
  const {
    answers,
    setAnswers,
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
  } = useAnswerableExamNavigation({
    subjectId: Number.parseInt(resolvedParams.id, 10),
    mode: resolvedParams.mode,
    nOfQuestions,
    filter,
    handleConfirm
  });

  async function handleConfirm() {
    if (isSubmitting) return;

    removeEventListener();

    const data = {
      subject_id: Number.parseInt(resolvedParams.id, 10),
      answers: questions.map((q) => ({
        question_id: q.id,
        selected_option: answers.get(q.id) || null
      })),
      time: examTime
    };

    const urlParams = new URLSearchParams();
    urlParams.set('mode', resolvedParams.mode);
    if (resolvedParams.mode === 'custom' && nOfQuestions && penalizingFactor) {
      urlParams.set('n_of_questions', nOfQuestions);
      urlParams.set('penalizing_factor', penalizingFactor);
    }

    const baseUrl = session.token ? PROTECTED_API_BASE_URL : BASE_URL;
    const url = `${baseUrl}/exams/verify?${urlParams.toString()}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (session.token) {
      headers.Authorization = `Bearer ${session.token}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (res.status === 200) {
      setExamResult(await res.json());

      // Clear saved state
      try {
        const subjectId = Number.parseInt(resolvedParams.id, 10);
        localStorage.removeItem(`exam-state-${subjectId}`);
        if (session.token) {
          const mode = resolvedParams.mode;
          fetch(`${PROTECTED_API_BASE_URL}/exams/state?subject_id=${subjectId}&mode=${encodeURIComponent(mode)}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${session.token}`
            }
          }).catch(console.error);
        }
      } catch (err) {
        console.error('Error clearing saved state:', err);
      }

      router.push(`/exams/${resolvedParams.id}/points`);
    } else {
      swal('Ocorreu um erro ao submeter o exame.', 'Por favor tenta novamente.', 'error', {
        className: themeRef.current === 'dark' ? 'swal-dark' : ''
      });
    }
  }

  useEffect(() => {
    let active = true;

    async function initExam() {
      const subjectId = Number.parseInt(resolvedParams.id, 10);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let savedState: any = null;

      try {
        if (session.token) {
          const mode = resolvedParams.mode;
          const res = await fetch(`${PROTECTED_API_BASE_URL}/exams/state?subject_id=${subjectId}&mode=${encodeURIComponent(mode)}`, {
            headers: {
              Authorization: `Bearer ${session.token}`
            }
          });
          if (res.status === 200) {
            const data = await res.json();
            savedState = data.state;
          }
        } else {
          const localStr = localStorage.getItem(`exam-state-${subjectId}`);
          if (localStr) {
            const data = JSON.parse(localStr);
            // Check expiry (3 days = 3 * 24 * 60 * 60 * 1000)
            if (Date.now() - data.savedAt < 3 * 24 * 60 * 60 * 1000) {
              savedState = data;
            } else {
              localStorage.removeItem(`exam-state-${subjectId}`);
            }
          }
        }
      } catch (err) {
        console.error('Error checking saved exam state:', err);
      }

      if (!active) return;

      if (savedState) {
        const resume = await swal({
          title: 'Exame inacabado',
          text: 'Tens um exame por terminar nesta disciplina. Desejas retomá-lo?',
          icon: 'info',
          buttons: ['Não, começar de novo', 'Sim, continuar'],
          className: themeRef.current === 'dark' ? 'swal-dark' : ''
        });

        if (!active) return;

        if (resume) {
          if (savedState.mode !== resolvedParams.mode) {
            const redirectUrl = new URL(
              `/exams/${subjectId}/answer/${savedState.mode}`,
              window.location.origin
            );
            if (savedState.n_of_questions) {
              redirectUrl.searchParams.set('n_of_questions', savedState.n_of_questions);
            }
            if (savedState.filter) {
              redirectUrl.searchParams.set('filter', savedState.filter);
            }
            router.push(redirectUrl.pathname + redirectUrl.search);
            return;
          }

          // Restore state
          setQuestions(savedState.questions);
          setAnswers(new Map<number, string>(savedState.answers));
          setExamTime(savedState.time);
          changeQuestion(savedState.currentQuestionIndex || 0);
          return;
        } else {
          // User chose to start fresh, clear the saved state
          localStorage.removeItem(`exam-state-${subjectId}`);
          if (session.token) {
            const mode = resolvedParams.mode;
            fetch(`${PROTECTED_API_BASE_URL}/exams/state?subject_id=${subjectId}&mode=${encodeURIComponent(mode)}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${session.token}`
              }
            }).catch(console.error);
          }
        }
      }

      // Load fresh exam
      try {
        const exam = await generateExam(
          subjectId,
          resolvedParams.mode,
          session.token,
          nOfQuestions ? Number.parseInt(nOfQuestions, 10) : undefined,
          filter ?? undefined
        );

        if (!active) return;

        if (exam === null) {
          swal('Ocorreu um erro ao carregar o exame.', 'Por favor tenta novamente.', 'error', {
            className: themeRef.current === 'dark' ? 'swal-dark' : ''
          });
          router.push('/exams');
          return;
        }

        const storedSeed = getShuffleSeed(subjectId);
        let orderedQuestions = exam;

        if (storedSeed) {
          orderedQuestions = shuffleWithSeed(exam, storedSeed);
        } else {
          const newSeed = `${resolvedParams.mode}-${Date.now()}`;
          setShuffleSeed(subjectId, newSeed);
          orderedQuestions = shuffleWithSeed(exam, newSeed);
        }

        setQuestions(orderedQuestions);
        setExamTime(0);
      } catch {
        if (!active) return;
        swal('Error', 'Por favor tenta novamente.', 'error', {
          className: themeRef.current === 'dark' ? 'swal-dark' : ''
        });
      }
    }

    async function setSubjectName() {
      const name = await getSubjectNameById(Number.parseInt(resolvedParams.id, 10));
      if (active) setSubject(name);
    }

    initExam();
    setSubjectName();

    return () => {
      active = false;
    };
  }, [
    resolvedParams.id,
    resolvedParams.mode,
    router,
    setQuestions,
    setAnswers,
    setExamTime,
    changeQuestion,
    session.token,
    nOfQuestions,
    filter
  ]);

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
              questionId={currentQuestion.id}
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
