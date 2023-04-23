'use client';

import { useContext, useEffect, useState } from 'react';

import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import PrimaryButton from '@/components/PrimaryButton';
import QuestionReview from '@/components/QuestionReview';
import { ExamContext } from 'src/contexts/ExamContext';
import useExamNavigation from 'src/hooks/useExamNavigation';
import { BASE_URL } from 'src/services/api';
import ExamReview from 'src/types/ExamReview';

interface ExamPageProps {
  params: {
    id: string;
  };
}

const reviewPage: React.FC<ExamPageProps> = ({ params }) => {
  const { subject } = useContext(ExamContext);
  const [examResult, setExamResult] = useState<ExamReview>();

  const {
    setCurrentQuestionIndex,
    currentQuestionIndex,
    currentQuestion,
    setCurrentQuestion,
    changeQuestion
  } = useExamNavigation<ExamReview['questions'][0]>();

  function getFirstWrongQuestionIndex() {
    if (!examResult) return;
    const wrongAnswer = examResult.questions.find((question) => question.is_wrong);
    if (!wrongAnswer) return;
    return examResult.questions.indexOf(wrongAnswer);
  }

  async function getExamResult() {
    const res = await fetch(BASE_URL + '/exams/' + params.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setExamResult(await res.json());
  }

  useEffect(() => {
    getExamResult();
  }, []);

  useEffect(() => {
    const index = getFirstWrongQuestionIndex();
    if (index) setCurrentQuestionIndex(index);
  }, [examResult]);

  useEffect(() => {
    if (examResult) setCurrentQuestion(examResult.questions[currentQuestionIndex]);
  }, [currentQuestionIndex, examResult]);

  const N_SKELETON_QUESTIONS = 10;
  const N_SKELETON_OPTIONS = 4;

  return (
    <section className="h-screen flex flex-col items-center">
      <p className="text-xl font-bold uppercase mt-10 ml-5">
        Exame de <span className="text-primary">{subject}</span>
      </p>
      <div className="mb-12">
        {examResult ? (
          <div className="w-screen flex items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-auto mt-5 px-5">
            {examResult.questions.map((question, i) => (
              <div
                key={question.question.id}
                onClick={() => changeQuestion(i)}
                className={`h-10 w-10 p-5 flex items-center justify-center
                ${question.is_wrong && 'bg-red-500 text-white'}
                ${
                  currentQuestionIndex === i
                    ? 'bg-primary text-white'
                    : 'border border-primary text-primary'
                }
            rounded-full hover:cursor-pointer`}>
                <p>{i + 1}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-screen flex  items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-auto mt-5 px-5">
            {Array.from({ length: N_SKELETON_QUESTIONS }).map((_, i) => (
              <Skeleton className="h-10 w-10 p-5 flex items-center justify-center " circle={true} />
            ))}
          </div>
        )}
        <section className="mt-5 px-5 md:px-32">
          <div className="relative w-full h-48">
            <Image
              fill
              alt="Subject"
              className="object-cover h-full w-full"
              src="/images/prcmp.jpg"
            />
          </div>

          {currentQuestion ? (
            <section className="mb-10">
              <QuestionReview currentQuestion={currentQuestion} />
              <div className="w-full flex justify-center mt-10">
                <PrimaryButton
                  className={`mr-4 ${currentQuestionIndex === 0 ? 'opacity-50' : ''}`}
                  onClick={() => changeQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}>
                  Anterior
                </PrimaryButton>
                <PrimaryButton
                  className={`${
                    currentQuestionIndex === examResult!.questions.length - 1 ? 'opacity-50' : ''
                  }`}
                  onClick={() => changeQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === examResult!.questions.length - 1}>
                  Seguinte
                </PrimaryButton>
              </div>
            </section>
          ) : (
            <div className="mt-12">
              <Skeleton className="h-20 mt-6" count={N_SKELETON_OPTIONS} />
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default reviewPage;
