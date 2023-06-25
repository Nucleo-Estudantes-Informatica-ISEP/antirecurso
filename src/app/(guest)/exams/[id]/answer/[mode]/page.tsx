'use client';

import { useContext, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { ExamContext } from 'src/contexts/ExamContext';
import { BASE_URL } from 'src/services/api';
import generateExam from 'src/services/generateExam';
import getSubjectNameById from 'src/utils/getSubjectNameById';

import ExamNumeration from '@/components/ExamNumeration';
import ExamNumerationContainer from '@/components/ExamNumerationContainer';
import PrimaryButton from '@/components/PrimaryButton';
import QuestionPrompt from '@/components/QuestionPrompt';
import useAnswerableExamNavigation from 'src/hooks/useAnswerableExamNavigation';
import getToken from 'src/services/getToken';

interface ExamPageProps {
  params: {
    id: string;
    mode: string;
  };
}

const N_SKELETON_QUESTIONS = 10;
const N_SKELETON_OPTIONS = 4;

const Exam: React.FC<ExamPageProps> = ({ params }) => {
  const router = useRouter();
  const [subject, setSubject] = useState('');

  const { setExamResult } = useContext(ExamContext);
  const {
    answers,
    submit,
    setQuestions,
    questions,
    wasAnswered,
    currentQuestionIndex,
    changeQuestion,
    removeEventListener,
    currentQuestion,
    selectAnswer,
    isSubmitting
  } = useAnswerableExamNavigation({ handleConfirm });

  async function handleConfirm() {
    removeEventListener();

    const data = {
      subject_id: parseInt(params.id),
      answers: [...Array.from({ length: questions.length }, (_, i) => i)].map((i) => ({
        question_id: questions[i].id,
        selected_option: answers.get(i) || null
      }))
    };

    const token = await getToken();

    const res = await fetch(`${BASE_URL}/exams/verify?mode=${params.mode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (res.status === 200) {
      setExamResult(await res.json());
      router.push(`/exams/${params.id}/points`);
    } else swal('Ocorreu um erro ao submeter o exame.', 'Por favor tente novamente.', 'error');
  }

  useEffect(() => {
    async function getExam(id: number, mode: string) {
      const exam = await generateExam(id, mode);
      if (exam === null) {
        swal('Ocorreu um erro ao carregar o exame.', 'Por favor tente novamente.', 'error');
        router.push('/exams');
        return;
      }
      setQuestions(exam);
    }

    async function setSubjectName() {
      setSubject(await getSubjectNameById(parseInt(params.id)));
    }

    getExam(parseInt(params.id), params.mode);
    setSubjectName();
  }, [params.id, params.mode, router, setQuestions]);

  return (
    <section className="h-[88vh] flex flex-col items-center overflow-x-scroll">
      <p className="text-xl font-bold uppercase mt-10 ml-5 text-center px-4">
        Exame de{' '}
        <span className="text-primary">{subject ? subject : <Skeleton width={100} />}</span>
      </p>
      <div className="mb-12 w-screen">
        {questions[0] ? (
          <ExamNumerationContainer>
            <PrimaryButton
              className={`h-10 w-10 p-5 items-center !rounded-full flex justify-center mr-4 ${
                currentQuestionIndex === 0 ? 'opacity-50' : ''
              }`}
              onClick={() => changeQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}>
              {'<'}
            </PrimaryButton>
            {questions.map((question, i) => (
              <ExamNumeration
                key={question.id}
                onClick={() => changeQuestion(i)}
                wasAnswered={wasAnswered(i)}
                active={currentQuestionIndex === i}
                align={i < 2 ? 'end' : i > questions.length - 2 ? 'start' : 'center'}>
                {i + 1}
              </ExamNumeration>
            ))}
            <PrimaryButton
              className={`h-10 w-10 p-5 items-center !rounded-full flex justify-center ${
                currentQuestionIndex === questions.length - 1 ? 'opacity-50' : ''
              }`}
              onClick={() => changeQuestion(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === questions.length - 1}>
              {'>'}
            </PrimaryButton>
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <form onSubmit={(e) => submit(e)}>
                <PrimaryButton>Terminar</PrimaryButton>
              </form>
            )}
          </ExamNumerationContainer>
        ) : (
          <div className="w-screen flex  items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-auto mt-5 px-5">
            {Array.from({ length: N_SKELETON_QUESTIONS }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-10 p-5 flex items-center justify-center "
                circle={true}
              />
            ))}
          </div>
        )}
        <section className="mt-5 px-5 md:px-32">
          <div className="relative w-full h-28 md:h-48">
            <Image
              fill
              alt="Subject"
              className="object-cover h-full w-full"
              src="/images/prcmp.webp"
            />
          </div>

          {currentQuestion ? (
            <section className="mb-10">
              <QuestionPrompt
                currentQuestion={currentQuestion}
                selectAnswer={selectAnswer}
                currentQuestionIndex={currentQuestionIndex}
                answers={answers}
              />
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

export default Exam;
