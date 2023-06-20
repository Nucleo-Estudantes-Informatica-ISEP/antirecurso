'use client';

import React, { useContext, useEffect } from 'react';

import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import CommentSection from '@/components/CommentSection';
import ExamNumeration from '@/components/ExamNumeration';
import ExamNumerationContainer from '@/components/ExamNumerationContainer';
import PrimaryButton from '@/components/PrimaryButton';
import QuestionReview from '@/components/QuestionReview';
import { ExamContext } from 'src/contexts/ExamContext';
import useExamReviewNavigation from 'src/hooks/useExamReviewNavigation';
import useToken from 'src/hooks/useToken';
import { BASE_URL } from 'src/services/api';

interface ExamPageProps {
  params: {
    id: string;
  };
}

const ReviewPage: React.FC<ExamPageProps> = ({ params }) => {
  const { subject } = useContext(ExamContext);

  const {
    currentQuestionIndex,
    currentQuestion,
    changeQuestion,
    setExamResult,
    examResult,
    removeEventListener,
    addListener
  } = useExamReviewNavigation();

  async function getExamResult() {
    const res = await fetch(`${BASE_URL}/exams/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      //? maybe separate this in two different methods, one with hydration for the first time and another without hydration for the fetch after comment
      cache: 'no-cache'
    });

    setExamResult(await res.json());
  }

  async function submitComment(comment: string) {
    const token = await useToken();

    await fetch(`${BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        comment: comment,
        question_id: currentQuestion?.question.id
      })
    });

    getExamResult();
  }

  useEffect(() => {
    getExamResult();
  }, []);

  const N_SKELETON_QUESTIONS = 10;
  const N_SKELETON_OPTIONS = 4;

  return (
    <section className="h-[88vh] flex flex-col items-center">
      <p className="text-xl font-bold uppercase mt-10 ml-5">
        Exame de <span className="text-primary">{subject}</span>
      </p>
      <div className="mb-12">
        {examResult ? (
          <ExamNumerationContainer>
            <PrimaryButton
              className={`h-10 w-10 p-5 items-center !rounded-full flex justify-center mr-4 ${
                currentQuestionIndex === 0 ? 'opacity-50' : ''
              }`}
              onClick={() => changeQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}>
              {'<'}
            </PrimaryButton>
            {examResult.questions.map((question, i) => (
              <ExamNumeration
                key={i}
                onClick={() => changeQuestion(i)}
                isWrong={question.is_wrong}
                active={currentQuestionIndex === i}>
                {i + 1}
              </ExamNumeration>
            ))}
            <PrimaryButton
              className={`h-10 w-10 p-5 items-center !rounded-full flex justify-center ${
                currentQuestionIndex === examResult.questions.length - 1 ? 'opacity-50' : ''
              }`}
              onClick={() => changeQuestion(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === examResult.questions.length - 1}>
              {'>'}
            </PrimaryButton>
          </ExamNumerationContainer>
        ) : (
          <div className="flex items-center w-screen px-5 mt-5 space-x-10 overflow-x-scroll md:justify-center md:overflow-auto">
            {Array.from({ length: N_SKELETON_QUESTIONS }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-10 p-5 flex items-center justify-center "
                circle={true}
              />
            ))}
          </div>
        )}
        <section className="px-5 mt-5 md:px-32">
          <div className="relative w-full h-48">
            <Image
              fill
              alt="Subject"
              className="object-cover w-full h-full"
              src="/images/prcmp.webp"
            />
          </div>

          {currentQuestion?.question ? (
            <QuestionReview currentQuestion={currentQuestion} />
          ) : (
            <div className="mt-12">
              <Skeleton className="h-20 mt-6" count={N_SKELETON_OPTIONS} />
            </div>
          )}
        </section>

        <CommentSection
          comments={examResult?.questions[currentQuestionIndex]?.comments}
          submitComment={submitComment}
          removeEventListener={removeEventListener}
          addListener={addListener}
        />
      </div>
    </section>
  );
};

export default ReviewPage;
