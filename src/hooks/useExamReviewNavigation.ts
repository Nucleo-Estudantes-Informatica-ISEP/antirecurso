import { useEffect, useState } from 'react';

import ExamReview from 'src/types/ExamReview';
import useExamNavigation from './useExamNavigation';

export default function useExamReviewNavigation() {
  const [examResult, setExamResult] = useState<ExamReview | null>(null);

  const {
    changeQuestion,
    setQuestions,
    questions,
    currentQuestionIndex,
    currentQuestion,
    setCurrentQuestion,
    removeEventListener,
    addListener
  } = useExamNavigation<ExamReview['questions'][0]>();

  useEffect(() => {
    if (examResult) setCurrentQuestion(examResult.questions[currentQuestionIndex]);
  }, [currentQuestionIndex, examResult, setQuestions, setCurrentQuestion]);

  useEffect(() => {
    setQuestions(examResult?.questions || []);
  }, [examResult]);

  return {
    changeQuestion,
    setCurrentQuestion,
    setQuestions,
    addListener,
    removeEventListener,
    questions,
    currentQuestionIndex,
    currentQuestion,
    examResult,
    setExamResult
  };
}
