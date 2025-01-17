'use client';

import { useContext, useEffect, useState } from 'react';

import Link from 'next/link';

import PrimaryButton from '@/components/utils/PrimaryButton';
import { ExamContext } from 'src/contexts/ExamContext';

import ScoreIndicator from '@/components/profile/ScoreIndicator';
import useSession from '@/hooks/useSession';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import ReactCanvasConfetti from 'react-canvas-confetti';
import swal from 'sweetalert';

const Points: React.FC = () => {
  const session = useSession();
  const router = useRouter();
  const [fire, setFire] = useState(false);
  const { examResult, examTime } = useContext(ExamContext);

  const { theme } = useTheme();

  function handleReview() {
    if (!examResult) {
      swal({
        title: 'Erro',
        text: 'Não foi possível obter o resultado do exame.',
        icon: 'error',
        className: theme === 'dark' ? 'swal-dark' : ''
      });

      router.push('/');
      return;
    }
    router.push('/exams/' + examResult.id + '/review');
  }

  useEffect(() => {
    setFire(true);
  }, []);

  if (!examResult) {
    swal({
      title: 'Erro',
      text: 'Não foi possível obter o resultado do exame.',
      icon: 'error',
      className: theme === 'dark' ? 'swal-dark' : ''
    });

    router.push('/');
    return null;
  }

  const minutes = Math.floor(examTime / 60);
  const seconds = examTime % 60;

  return (
    <section className="flex flex-col items-center justify-center w-full text-center mb-8">
      <p className="px-4 ml-5 text-xl font-bold text-center uppercase my-5">
        Exame de <span className="text-primary">{examResult.subject}</span>
      </p>

      <p className="text-lg md:text-xl align-middle mx-6">
        Demoraste{' '}
        <span className="text-primary font-black align-middle">
          {minutes ? `${minutes} minutos e` : ''} {seconds} segundos
        </span>{' '}
        a responder ao exame.
      </p>

      <ScoreIndicator score={examResult.score} className="mt-8"></ScoreIndicator>

      <section className="relative flex flex-col items-center justify-center px-4 mt-14 text-center z-50">
        {examResult?.passed ? (
          <>
            <p className="text-xl font-semibold">
              <span className="text-primary">Parabéns!</span> Passaste no exame! 🎉
            </p>
            <p className="max-w-screen-lg px-10 mt-5">
              Continua com o teu excelente trabalho! Podes sempre verificar as tuas estatísticas
              para perceber a tua evolução no teu{' '}
              <Link className="underline text-primary" href="/profile">
                perfil
              </Link>
              .
            </p>
            <p className="semibold">Bom esforço!</p>
            <ReactCanvasConfetti
              particleCount={150}
              fire={fire}
              origin={{ y: 0.9 }}
              className="fixed z-20 w-full h-full"
            />
          </>
        ) : (
          <>
            <p className="text-xl font-semibold">
              <span className="text-primary">Ohhh...</span> reprovaste no exame... 😔
            </p>
            <p className="mt-5 w-5/6">
              Os professores bem avisaram que as teóricas eram importantes... <br /> Mas não te
              preocupes! Continua a estudar e a resolver exames para tentar melhorar. Podes sempre
              verificar as tuas estatísticas para perceber a tua evolução no teu{' '}
              <Link className="underline text-primary" href="/profile">
                perfil
              </Link>
              .
            </p>
            <p className="semibold">Continua!</p>
          </>
        )}
        <PrimaryButton onClick={handleReview} className="z-50 mt-16 mb-4">
          Verificar respostas
        </PrimaryButton>
        {!session.user && (
          <p className="z-50 mx-5 mt-3 text-xs">
            Não te esqueças que podes criar uma conta para guardar o teu progresso clicando{' '}
            <Link className="underline cursor-pointer" href="/register">
              aqui
            </Link>
            .
          </p>
        )}
      </section>
    </section>
  );
};

export default Points;
