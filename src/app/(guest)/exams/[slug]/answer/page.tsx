'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import PrimaryButton from '@/components/PrimaryButton';
import { Check } from '@/styles/Icons';
import { mockQuestions, Question } from 'src/mock/mockQuestions';

interface ExamPageProps {
  params: {
    slug: string;
  };
}

const Exam: React.FC<ExamPageProps> = ({ params }) => {
  const [currentQuestionIndex, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map<number, number>());

  let currentQuestion: Question = mockQuestions[currentQuestionIndex];

  function changeQuestion(i: number) {
    setCurrentQuestion(i);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(answers);
  }

  function selectAnswer(question: number, order: number) {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.set(question, order);
      return newAnswers;
    });
  }

  function wasAnswered(i: number) {
    // TODO
    return false;
  }

  useEffect(() => {
    currentQuestion = mockQuestions[currentQuestionIndex];
  }, [currentQuestionIndex]);

  return (
    <div className="mb-12">
      <div className="w-screen flex items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-auto mt-5 px-5">
        {mockQuestions.map((_, i) => (
          <div
            onClick={() => changeQuestion(i)}
            className={`h-10 w-10 p-5 flex items-center justify-center ${
              currentQuestionIndex === i
                ? 'bg-primary text-white'
                : 'border border-primary text-primary'
            } ${
              wasAnswered(i) && 'bg-primary bg-opacity-70 text-white'
            } rounded-full hover:cursor-pointer`}>
            <p>{i + 1}</p>
          </div>
        ))}
      </div>
      <section className="mt-5 px-5 md:px-32">
        <div className="relative w-full h-48">
          <Image
            fill
            alt="Subject"
            className="object-cover h-full w-full"
            src="/images/prcmp.jpg"
          />
        </div>

        <section className="mb-10">
          <p className="text-lg font-bold mt-5">{currentQuestion.question}</p>
          <p className="text-sm text-gray-600 mt-2">
            Tipo de pergunta '{currentQuestion.question_type.name}' do exame '{currentQuestion.exam}
            '
          </p>
          <div className="mt-5 space-y-5">
            {currentQuestion.options.map((option) => (
              <div
                onClick={() => selectAnswer(currentQuestionIndex, option.order)}
                className={`w-full flex items-center px-5 py-3 border border-gray-100 h-20 rounded hover:cursor-pointer hover:bg-primary hover:text-white transition ease-in-out ${
                  answers.get(currentQuestionIndex) === option.order && 'bg-primary text-white'
                }`}>
                <p>{option.name}</p>
                {answers.get(currentQuestionIndex) === option.order && <Check className="ml-5" />}
              </div>
            ))}
          </div>
        </section>

        {currentQuestionIndex === mockQuestions.length - 1 && (
          <div className="w-full flex justify-end">
            <form onSubmit={handleSubmit}>
              <PrimaryButton>Terminar</PrimaryButton>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default Exam;
