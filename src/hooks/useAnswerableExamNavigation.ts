'use client';

import { useCallback, useEffect, useState } from 'react';

import swal from 'sweetalert';

import { useTheme } from 'next-themes';
import Question from 'src/types/Question';
import useExamNavigation from './useExamNavigation';

export default function useAnswerableExamNavigation({
  handleConfirm
}: {
  handleConfirm: () => Promise<void>;
}) {
  const [answers, setAnswers] = useState<Map<number, string>>(new Map<number, string>());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme } = useTheme();

  const {
    changeQuestion,
    setQuestions,
    questions,
    currentQuestionIndex,
    currentQuestion,
    setCurrentQuestion
  } = useExamNavigation<Question>();

  const hasAnsweredAllQuestions = useCallback((): boolean => {
    if (answers.size === questions.length) return true;

    return false;
  }, [answers, questions]);

  const optionOrders = currentQuestion?.options.map((option) => option.order);

  const wasAnswered = useCallback(
    (i: number) => {
      return answers.has(i);
    },
    [answers]
  );

  const selectAnswer = useCallback((question: number, order: string) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      if (newAnswers.get(question) === order) newAnswers.delete(question);
      else newAnswers.set(question, order);
      return newAnswers;
    });
  }, []);

  const cycleOptions = useCallback(
    (direction: 'UP' | 'DOWN') => {
      if (!optionOrders) return;

      const currentOption = answers.get(currentQuestionIndex);
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
    [answers, currentQuestionIndex, optionOrders, selectAnswer]
  );

  const handleKeyDown: (e: KeyboardEvent) => void = useCallback(
    async (e: KeyboardEvent) => {
      if (!optionOrders) return;

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
          if (currentQuestionIndex === questions.length - 1) await submit();
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

  const submit = useCallback(
    async (e: React.FormEvent<HTMLFormElement> | void) => {
      if (e) e.preventDefault();
      removeEventListener();

      if (!hasAnsweredAllQuestions()) {
        const confirmed = await swal({
          title: 'Não respondeste a todas as questões do exame.',
          text: 'Tens a certeza que queres terminar o exame?',
          icon: 'warning',
          buttons: ['Cancelar', 'Continuar'],
          className: theme === 'dark' ? 'swal-dark' : ''
        });

        if (!confirmed) return;
      }

      const confirmed = await swal({
        title: 'Tens a certeza que queres terminar o exame?',
        icon: 'warning',
        buttons: ['Não', 'Sim'],
        className: theme === 'dark' ? 'swal-dark' : ''
      });

      if (!confirmed) return;

      setIsSubmitting(true);
      handleConfirm();
      setIsSubmitting(false);
    },
    [handleConfirm, hasAnsweredAllQuestions, removeEventListener]
  );

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
    questions,
    currentQuestionIndex,
    currentQuestion,
    submit,
    isSubmitting
  };
}
