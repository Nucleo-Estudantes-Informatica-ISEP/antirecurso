'use client';

import { useContext, useEffect } from 'react';

import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { Check, X } from '@/styles/Icons';
import { ExamContext } from 'src/contexts/ExamContext';
import useExamReviewNavigation from 'src/hooks/useExamReviewNavigation';
import { BASE_URL } from 'src/services/api';

interface ExamPageProps {
  params: {
    id: string;
  };
}

const reviewPage: React.FC<ExamPageProps> = ({ params }) => {
  const { subject } = useContext(ExamContext);

  const { currentQuestionIndex, currentQuestion, changeQuestion, setExamResult, examResult } =
    useExamReviewNavigation();

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
    if (index) changeQuestion(index);
  }, [examResult]);

  const N_SKELETON_QUESTIONS = 10;
  const N_SKELETON_OPTIONS = 4;

  return (
    <section className="h-[90vh] flex flex-col items-center">
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

          {currentQuestion?.question ? (
            <section className="mb-10">
              <p className="text-lg font-bold mt-5">{currentQuestion.question.question}</p>
              <p className="text-sm text-gray-600 mt-2">
                Tipo de pergunta '{currentQuestion.question.question_type}' do exame '
                {currentQuestion.question.exam}'
              </p>
              <div className="mt-5 space-y-5">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.name}
                    className={`w-full flex items-center px-5 py-3 border border-gray-100 h-20 rounded hover:cursor-pointer hover:bg-primary hover:text-white transition ease-in-out ${
                      currentQuestion.selected_option_id === option.id && 'bg-primary text-white'
                    }`}>
                    <p>{option.name}</p>
                    {currentQuestion.selected_option_id === option.id &&
                      currentQuestion.is_wrong == true && <X className="ml-5" />}
                    {currentQuestion.correct_option === option.order && <Check className="ml-5" />}
                  </div>
                ))}
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
