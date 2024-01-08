'use client';

import { useContext, useEffect, useState } from 'react';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import swal from 'sweetalert';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { ExamContext } from '@/contexts/ExamContext';
import { BASE_URL } from '@/services/api';
import generateExam from '@/services/generateExam';
import getSubjectNameById from '@/utils/getSubjectNameById';

import ExamNumeration from '@/components/ExamNumeration';
import ExamNumerationContainer from '@/components/ExamNumerationContainer';
import PrimaryButton from '@/components/PrimaryButton';
import QuestionPrompt from '@/components/QuestionPrompt';
import useAnswerableExamNavigation from '@/hooks/useAnswerableExamNavigation';
import useSession from '@/hooks/useSession';

import sampleImage from 'public/images/sample.webp';

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
  const searchParams = useSearchParams();

  const nOfQuestions = searchParams.get('n_of_questions');
  const penalizingFactor = searchParams.get('penalizing_factor');

  const [subject, setSubject] = useState('');

  const session = useSession();
  const { theme } = useTheme();

  const { setExamResult, examTime, setExamTime } = useContext(ExamContext);
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
    if (isSubmitting) return;

    removeEventListener();

    const data = {
      subject_id: parseInt(params.id),
      answers: [...Array.from({ length: questions.length }, (_, i) => i)].map((i) => ({
        question_id: questions[i].id,
        selected_option: answers.get(i) || null
      }))
    };

    const url =
      params.mode === 'custom' && nOfQuestions && penalizingFactor
        ? `${BASE_URL}/exams/verify?mode=${params.mode}&n_of_questions=${nOfQuestions}&penalizing_factor=${penalizingFactor}`
        : `${BASE_URL}/exams/verify?mode=${params.mode}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`
      },
      body: JSON.stringify(data)
    });

    if (res.status === 200) {
      setExamResult(await res.json());
      router.push(`/exams/${params.id}/points`);
    } else {
      swal('Ocorreu um erro ao submeter o exame.', 'Por favor tente novamente.', 'error', {
        className: theme === 'dark' ? 'swal-dark' : ''
      });
    }
  }

  useEffect(() => {
    async function getExam(id: number, mode: string, n_of_questions?: number) {
      try {
        console.log(id);
        const exam = await generateExam(id, mode, session.token, n_of_questions);
        if (exam === null) {
          swal('Ocorreu um erro ao carregar o exame.', 'Por favor tente novamente.', 'error', {
            className: theme === 'dark' ? 'swal-dark' : ''
          });
          router.push('/exams');
          return;
        }
        setQuestions(exam);
      } catch (err) {
        swal('Error', 'Por favor tente novamente.', 'error', {
          className: theme === 'dark' ? 'swal-dark' : ''
        });
      }
    }

    async function setSubjectName() {
      setSubject(await getSubjectNameById(parseInt(params.id)));
    }

    if (nOfQuestions !== undefined && nOfQuestions !== null) {
      getExam(parseInt(params.id), params.mode, parseInt(nOfQuestions as string));
    } else {
      getExam(parseInt(params.id), params.mode);
    }

    setSubjectName();
  }, [params.id, params.mode, router, setQuestions, session.token, theme, nOfQuestions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setExamTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [setExamTime]);

  return (
    <section className="flex flex-col items-center overflow-x-scroll relative">
      <span className="-top-1 left-8 absolute font-bold text-2xl align-middle">
        {Math.floor(examTime / 60)}:{examTime % 60 < 10 ? `0${examTime % 60}` : examTime % 60}
      </span>
      <p className="px-4 my-5 ml-5 text-xl font-bold text-center uppercase">
        Exame de{' '}
        <span className="text-primary">{subject ? subject : <Skeleton width={100} />}</span>
      </p>
      <div className="w-screen mb-12">
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
              <div className="w-10 h-10 border-t-2 border-b-2 rounded-full animate-spin border-primary">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <form onSubmit={(e) => submit(e)}>
                <PrimaryButton>Terminar</PrimaryButton>
              </form>
            )}
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
          {currentQuestion ? (
            <section className="mb-10">
              <div
                className={`relative w-full ${
                  currentQuestion.image === '' ? 'md:h-[10rem] h-20' : 'md:h-[24rem] h-[16rem]'
                }`}>
                {currentQuestion.image === '' ? (
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
                    src={currentQuestion.image}
                  />
                )}
              </div>
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
