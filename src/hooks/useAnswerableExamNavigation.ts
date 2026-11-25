'use client';

import { useMessages } from '@/i18n/client';

import { useCallback, useEffect, useRef, useState, useContext } from 'react';

import swal from 'sweetalert';

import { useTheme } from 'next-themes';
import Question from 'src/types/Question';
import useExamNavigation from './useExamNavigation';
import useSession from '@/hooks/useSession';
import { ExamContext } from '@/contexts/ExamContext';
import { apiFetch, throwApiResponseError } from '@/services/apiClient';
import { createSavedExamState, getLocalExamStateKey } from '@/services/examState';

export default function useAnswerableExamNavigation({
  subjectId,
  mode,
  nOfQuestions,
  penalizingFactor,
  filter,
  handleConfirm
}: {
  subjectId: number;
  mode: string;
  nOfQuestions?: string | null;
  penalizingFactor?: string | null;
  filter?: string | null;
  handleConfirm: () => Promise<void>;
}) {
  const t = useMessages();

  const [answers, setAnswers] = useState<Map<number, string>>(new Map<number, string>());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitRef = useRef<() => Promise<void>>(async () => {});
  const saveRequestRef = useRef<AbortController | null>(null);

  const { theme } = useTheme();
  const session = useSession();
  const { examTime } = useContext(ExamContext);

  const {
    changeQuestion,
    setQuestions,
    questions,
    currentQuestionIndex,
    currentQuestion,
    setCurrentQuestion
  } = useExamNavigation<Question>();

  const lastAnswersRef = useRef<string>(
    JSON.stringify(Array.from(new Map<number, string>().entries()))
  );
  const lastIndexRef = useRef<number>(0);
  const lastSavedTimeRef = useRef<number>(0);

  // Auto-save exam state on progress changes
  useEffect(() => {
    if (questions.length === 0 || isSubmitting) return;

    const serializedAnswers = JSON.stringify(Array.from(answers.entries()));

    const stateData = createSavedExamState({
      subjectId,
      mode,
      questions,
      answers,
      time: examTime,
      currentQuestionIndex,
      nOfQuestions,
      penalizingFactor,
      filter
    });

    // Save to localStorage immediately
    localStorage.setItem(getLocalExamStateKey(subjectId, mode), JSON.stringify(stateData));

    if (!session.token) return;

    // Save to backend if answers, current question, or >= 10s of time elapsed
    const answersChanged = serializedAnswers !== lastAnswersRef.current;
    const indexChanged = currentQuestionIndex !== lastIndexRef.current;
    const timeThresholdPassed =
      lastSavedTimeRef.current === -1 || examTime - lastSavedTimeRef.current >= 10;

    if (answersChanged || indexChanged || timeThresholdPassed) {
      lastAnswersRef.current = serializedAnswers;
      lastIndexRef.current = currentQuestionIndex;
      lastSavedTimeRef.current = examTime;

      saveRequestRef.current?.abort();
      const controller = new AbortController();
      saveRequestRef.current = controller;

      const saveToBackend = async () => {
        try {
          const response = await apiFetch('exams/state', {
            authenticated: true,
            method: 'POST',
            json: {
              subject_id: subjectId,
              mode,
              state: stateData
            },
            signal: controller.signal
          });
          if (!response.ok && response.status !== 409) {
            await throwApiResponseError(response, t('copy.could_not_save_exam_progress'));
          }
        } catch (err) {
          if (!controller.signal.aborted) {
            console.error('Failed to save exam state to backend:', err);
          }
        }
      };

      saveToBackend();
    }

    return () => saveRequestRef.current?.abort();
  }, [
    questions,
    answers,
    currentQuestionIndex,
    examTime,
    session.token,
    subjectId,
    mode,
    nOfQuestions,
    penalizingFactor,
    filter,
    isSubmitting,
    t
  ]);

  const hasAnsweredAllQuestions = useCallback((): boolean => {
    if (answers.size === questions.length) return true;

    return false;
  }, [answers, questions]);

  const optionOrders = currentQuestion?.options.map((option) => option.order);

  const wasAnswered = useCallback(
    (i: number) => {
      const questionId = questions[i]?.id;
      if (questionId === undefined) return false;
      return answers.has(questionId);
    },
    [answers, questions]
  );

  const selectAnswer = useCallback(
    (questionIndex: number, order: string) => {
      const questionId = questions[questionIndex]?.id;
      if (questionId === undefined) return;
      setAnswers((prev) => {
        const newAnswers = new Map(prev);
        if (newAnswers.get(questionId) === order) newAnswers.delete(questionId);
        else newAnswers.set(questionId, order);
        return newAnswers;
      });
    },
    [questions]
  );

  const cycleOptions = useCallback(
    (direction: 'UP' | 'DOWN') => {
      if (!optionOrders || !currentQuestion) return;

      const questionId = currentQuestion.id;
      const currentOption = answers.get(questionId);
      if (!currentOption && direction === 'DOWN')
        return selectAnswer(currentQuestionIndex, optionOrders[0]);
      if (!currentOption && direction === 'UP')
        return selectAnswer(currentQuestionIndex, optionOrders[optionOrders.length - 1]);
      if (!currentOption) return selectAnswer(currentQuestionIndex, optionOrders[0]);

      const currentIndex = optionOrders.indexOf(currentOption);

      const multiplier = direction === 'UP' ? -1 : 1;
      const nextIndex = currentIndex + 1 * multiplier;

      if (nextIndex >= optionOrders.length) selectAnswer(currentQuestionIndex, optionOrders[0]);
      else if (nextIndex < 0)
        selectAnswer(currentQuestionIndex, optionOrders[optionOrders.length - 1]);
      else selectAnswer(currentQuestionIndex, optionOrders[nextIndex]);
    },
    [answers, currentQuestion, currentQuestionIndex, optionOrders, selectAnswer]
  );

  const handleKeyDown: (e: KeyboardEvent) => void = useCallback(
    async (e: KeyboardEvent) => {
      if (!optionOrders || !currentQuestion) return;

      switch (e.key) {
        case '1':
          if (currentQuestion?.options[0]) selectAnswer(currentQuestionIndex, optionOrders[0]);
          break;
        case '2':
          if (currentQuestion?.options[1]) selectAnswer(currentQuestionIndex, optionOrders[1]);
          break;
        case '3':
          if (currentQuestion?.options[2]) selectAnswer(currentQuestionIndex, optionOrders[2]);
          break;
        case '4':
          if (currentQuestion?.options[3]) selectAnswer(currentQuestionIndex, optionOrders[3]);
          break;
        case ' ':
          e.preventDefault();
          cycleOptions('DOWN');
          break;
        case 'ArrowUp':
          e.preventDefault();
          cycleOptions('UP');
          break;
        case 'ArrowDown':
          e.preventDefault();
          cycleOptions('DOWN');
          break;
        case 'Enter':
          e.preventDefault();
          if (currentQuestionIndex === questions.length - 1) await submitRef.current();
          if (wasAnswered(currentQuestionIndex)) changeQuestion(currentQuestionIndex + 1);
        default:
          break;
      }
    },
    [
      changeQuestion,
      currentQuestion,
      currentQuestionIndex,
      cycleOptions,
      optionOrders,
      selectAnswer,
      wasAnswered,
      questions
    ]
  );

  const removeEventListener = useCallback(() => {
    window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const submit = useCallback(
    async (e: React.FormEvent<HTMLFormElement> | void) => {
      if (e) e.preventDefault();
      removeEventListener();

      if (!hasAnsweredAllQuestions()) {
        const confirmed = await swal({
          title: t('copy.you_have_not_answered_all_exam_questions'),
          text: t('copy.are_you_sure_you_want_to_finish_the_exam'),
          icon: 'warning',
          buttons: [t('copy.cancel'), t('common.continue')],
          className: theme === 'dark' ? 'swal-dark' : ''
        });

        if (!confirmed) return;
      }

      const confirmed = await swal({
        title: t('copy.are_you_sure_you_want_to_finish_the_exam'),
        icon: 'warning',
        buttons: [t('common.no'), t('common.yes')],
        className: theme === 'dark' ? 'swal-dark' : ''
      });

      if (!confirmed) return;

      setIsSubmitting(true);
      saveRequestRef.current?.abort();
      try {
        await handleConfirm();
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleConfirm, hasAnsweredAllQuestions, removeEventListener, theme, t]
  );

  useEffect(() => {
    submitRef.current = submit;
  }, [submit]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return removeEventListener;
  }, [
    currentQuestionIndex,
    currentQuestion,
    wasAnswered,
    changeQuestion,
    selectAnswer,
    cycleOptions,
    removeEventListener,
    handleKeyDown
  ]);

  useEffect(() => {
    setCurrentQuestion(questions[currentQuestionIndex]);
  }, [questions, currentQuestionIndex, setCurrentQuestion]);

  return {
    wasAnswered,
    selectAnswer,
    hasAnsweredAllQuestions,
    changeQuestion,
    setCurrentQuestion,
    removeEventListener,
    setQuestions,
    answers,
    setAnswers,
    questions,
    currentQuestionIndex,
    currentQuestion,
    submit,
    isSubmitting
  };
}
