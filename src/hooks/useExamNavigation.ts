import { useCallback, useEffect, useState } from 'react';

export default function useExamNavigation<T>() {
  const [questions, setQuestions] = useState<T[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<T | null>(null);

  const changeQuestion = useCallback(
    (i: number) => {
      if (i >= 0 && i < questions.length) setCurrentQuestionIndex(i);
    },
    [questions.length]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          changeQuestion(currentQuestionIndex - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          changeQuestion(currentQuestionIndex + 1);
          break;
      }
    },
    [changeQuestion, currentQuestionIndex]
  );

  const removeEventListener = useCallback(() => {
    window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const addListener = useCallback(() => {
    window.addEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    addListener();

    return removeEventListener;
  }, [currentQuestionIndex, changeQuestion, removeEventListener, addListener]);

  return {
    changeQuestion,
    setQuestions,
    addListener,
    removeEventListener,
    questions,
    currentQuestionIndex,
    currentQuestion,
    setCurrentQuestion
  };
}
