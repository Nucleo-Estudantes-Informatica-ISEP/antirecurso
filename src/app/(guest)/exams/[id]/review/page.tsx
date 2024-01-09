'use client';

import React, { useCallback, useEffect } from 'react';

import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import CommentSection from '@/components/CommentSection';
import ExamNumeration from '@/components/ExamNumeration';
import ExamNumerationContainer from '@/components/ExamNumerationContainer';
import PrimaryButton from '@/components/PrimaryButton';
import QuestionReview from '@/components/QuestionReview';
import useSession from '@/hooks/useSession';
import sampleImage from 'public/images/sample.webp';
import useExamReviewNavigation from 'src/hooks/useExamReviewNavigation';
import { BASE_URL } from 'src/services/api';

interface ExamPageProps {
  params: {
    id: string;
  };
}

const ReviewPage: React.FC<ExamPageProps> = ({ params }) => {
  const session = useSession();

  const {
    currentQuestionIndex,
    currentQuestion,
    changeQuestion,
    setExamResult,
    examResult,
    removeEventListener,
    addListener
  } = useExamReviewNavigation();

  const getExamResult = useCallback(async () => {
    const res = await fetch(`${BASE_URL}/exams/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      //? maybe separate this in two different methods, one with hydration for the first time and another without hydration for the fetch after comment
      cache: 'no-cache'
    });

    setExamResult(await res.json());
  }, [params.id, setExamResult]);

  async function submitComment(comment: string) {
    if (!session.user) return;

    await fetch(`${BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`
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
  }, [getExamResult]);

  const N_SKELETON_QUESTIONS = 10;
  const N_SKELETON_OPTIONS = 4;

  return (
    <section className="flex flex-col items-center overflow-x-scroll ">
      <p className="px-4 my-5 ml-5 text-xl font-bold text-center uppercase">
        Exame de{' '}
        <span className="text-primary">
          {examResult?.subject ? examResult.subject : <Skeleton width={150} />}
        </span>
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
                active={currentQuestionIndex === i}
                align={i < 2 ? 'end' : i > examResult.questions.length - 2 ? 'start' : 'center'}>
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
                className="flex items-center justify-center w-10 h-10 p-5 "
                circle={true}
              />
            ))}
          </div>
        )}
        <section className="px-5 mt-5 md:px-32">
          {currentQuestion?.question ? (
            <section className="mb-10">
              <div
                className={`relative w-full ${
                  currentQuestion.question.image === ''
                    ? 'md:h-[10rem] h-20'
                    : 'md:h-[24rem] h-[16rem]'
                }`}>
                {currentQuestion.question.image === '' ? (
                  <Image
                    fill
                    alt="Sample Image"
                    className="object-cover w-full h-full"
                    src={sampleImage}
                  />
                ) : (
                  <Image
                    fill
                    alt="Question Image"
                    className="w-full object-contain h-full"
                    src={currentQuestion.question.image}
                  />
                )}
              </div>
              <QuestionReview currentQuestion={currentQuestion} />
            </section>
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
          questionId={currentQuestion?.question.id}
        />
      </div>
    </section>
  );
};

export default ReviewPage;
