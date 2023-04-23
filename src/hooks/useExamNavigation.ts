import { useEffect, useState } from 'react';

export default function useExamNavigation<T>() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<T | null>(null);
  const [answers, setAnswers] = useState<Map<number, string>>(new Map<number, string>());
  const [questions, setQuestions] = useState<T[]>([]);

  function changeQuestion(i: number) {
    if (i >= 0 && i < questions.length) setCurrentQuestionIndex(i);
  }

  function wasAnswered(i: number) {
    return answers.has(i);
  }

  useEffect(() => {
    setCurrentQuestion(questions[currentQuestionIndex]);
  }, [questions, currentQuestionIndex]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowLeft':
          changeQuestion(currentQuestionIndex - 1);
          break;
        case 'ArrowRight':
          changeQuestion(currentQuestionIndex + 1);
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentQuestionIndex, changeQuestion]);

  return {
    wasAnswered,
    changeQuestion,
    setCurrentQuestion,
    setQuestions,
    setAnswers,
    answers,
    questions,
    currentQuestionIndex,
    currentQuestion,
    setCurrentQuestionIndex
  };
}
