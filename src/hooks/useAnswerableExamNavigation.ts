import { useEffect } from 'react';

import swal from 'sweetalert';

import Question from 'src/types/Question';
import useExamNavigation from './useExamNavigation';

export default function useAnswerableExamNavigation({
  handleConfirm
}: {
  handleConfirm: () => Promise<void>;
}) {
  const {
    wasAnswered,
    changeQuestion,
    setCurrentQuestion,
    setQuestions,
    answers,
    questions,
    currentQuestionIndex,
    currentQuestion,
    setAnswers,
    setCurrentQuestionIndex
  } = useExamNavigation<Question>();

  function hasAnsweredAllQuestions(): boolean {
    if (answers.size === questions.length) return true;

    return false;
  }

  function selectAnswer(question: number, order: string) {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.set(question, order);
      return newAnswers;
    });
  }

  const optionOrders = currentQuestion?.options.map((option) => option.order);

  function cycleOptions() {
    if (!optionOrders) return;

    const currentOption = answers.get(currentQuestionIndex);
    if (!currentOption) return selectAnswer(currentQuestionIndex, optionOrders[0]);

    const currentIndex = optionOrders.indexOf(currentOption);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= optionOrders.length) selectAnswer(currentQuestionIndex, optionOrders[0]);
    else selectAnswer(currentQuestionIndex, optionOrders[nextIndex]);
  }

  async function submit(e: React.FormEvent<HTMLFormElement> | void) {
    if (e) e.preventDefault();

    if (!hasAnsweredAllQuestions()) {
      const confirmed = await swal({
        title: 'Não respondeu a todas as questões do exame.',
        text: 'Tem a certeza que quer terminar o exame?',
        icon: 'warning',
        buttons: ['Cancelar', 'Continuar']
      });

      if (!confirmed) return;
    }

    const confirmed = await swal({
      title: 'Tem a certeza que quer terminar o exame?',
      icon: 'warning',
      buttons: ['Não', 'Sim']
    });

    if (!confirmed) return;

    handleConfirm();
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case '1':
        case 'a':
          if (currentQuestion?.options[0].order === '1') selectAnswer(currentQuestionIndex, '1');
          break;
        case '2':
        case 'b':
          if (currentQuestion?.options[1].order === '2') selectAnswer(currentQuestionIndex, '2');
          break;
        case '3':
        case 'c':
          if (currentQuestion?.options[2]?.order === '3') selectAnswer(currentQuestionIndex, '3');
          break;
        case '4':
        case 'd':
          if (currentQuestion?.options[3] && currentQuestion.options[3].order === '4')
            selectAnswer(currentQuestionIndex, '4');
          break;
        case ' ':
          cycleOptions();
          break;
        case 'Enter':
          if (currentQuestionIndex === questions.length - 1) {
            window.removeEventListener('keydown', handleKeyDown);
            submit();
          }
          if (wasAnswered(currentQuestionIndex)) changeQuestion(currentQuestionIndex + 1);
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentQuestionIndex,
    currentQuestion,
    wasAnswered,
    changeQuestion,
    selectAnswer,
    cycleOptions
  ]);

  return {
    wasAnswered,
    selectAnswer,
    hasAnsweredAllQuestions,
    changeQuestion,
    setCurrentQuestion,
    setQuestions,
    answers,
    questions,
    currentQuestionIndex,
    currentQuestion,
    setCurrentQuestionIndex,
    submit
  };
}
