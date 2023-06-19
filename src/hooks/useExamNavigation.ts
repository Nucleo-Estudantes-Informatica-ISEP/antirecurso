import { useEffect, useState } from 'react';

export default function useExamNavigation<T>() {
  const [questions, setQuestions] = useState<T[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<T | null>(null);

  function changeQuestion(i: number) {
    if (i >= 0 && i < questions.length) setCurrentQuestionIndex(i);
  }

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

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, changeQuestion]);

  return {
    changeQuestion,
    setQuestions,
    questions,
    currentQuestionIndex,
    currentQuestion,
    setCurrentQuestion
  };
}
