import { useEffect, useState } from 'react';

export default function useExamNavigation<T>() {
  const [questions, setQuestions] = useState<T[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<T | null>(null);

  function changeQuestion(i: number) {
    if (i >= 0 && i < questions.length) setCurrentQuestionIndex(i);
  }

  function handleKeyDown(e: KeyboardEvent) {
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
  }

  function removeEventListener() {
    window.removeEventListener('keydown', handleKeyDown);
  }

  function addListener() {
    window.addEventListener('keydown', handleKeyDown);
  }

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
