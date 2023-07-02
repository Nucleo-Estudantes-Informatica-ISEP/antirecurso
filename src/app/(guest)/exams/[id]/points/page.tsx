'use client';

import { useContext, useEffect, useState } from 'react';

import Link from 'next/link';

import PrimaryButton from '@/components/PrimaryButton';
import { ExamContext } from 'src/contexts/ExamContext';

import { useRouter } from 'next/navigation';
import ReactCanvasConfetti from 'react-canvas-confetti';
import getToken from 'src/services/getToken';
import toFixed from 'src/utils/toFixed';
import swal from 'sweetalert';

interface ExamPageProps {
  params: {
    id: string;
  };
}

const Points: React.FC<ExamPageProps> = ({ params }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>();
  const [fire, setFire] = useState(false);
  const { examResult } = useContext(ExamContext);

  function handleReview() {
    if (!examResult) {
      swal({
        title: 'Erro',
        text: 'Não foi possível obter o resultado do exame.',
        icon: 'error'
      });

      router.push('/');
      return;
    }
    router.push('/exams/' + examResult.id + '/review');
  }

  async function getUserToken() {
    const token = await getToken();
    setToken(token);
  }

  useEffect(() => {
    setFire(true);
    getUserToken();
  }, []);

  if (!examResult) {
    swal({
      title: 'Erro',
      text: 'Não foi possível obter o resultado do exame.',
      icon: 'error'
    });

    router.push('/');
    return null;
  }

  return (
    <section className="flex flex-col items-center w-full h-screen mt-4">
      <p className="px-4 ml-5 text-xl font-bold text-center uppercase md:mt-36">
        Exame de <span className="text-primary">{examResult.subject}</span>
      </p>
      <div className="flex items-center justify-center mt-10 space-x-3">
        <div className="flex items-center justify-center w-12 h-12 p-5 text-white rounded-full bg-primary">
          {toFixed(examResult?.score, 1)}
        </div>
        <p className="text-xl font-bold uppercase">pontos</p>
      </div>

      <div className="flex items-center justify-center mt-10 space-x-3">
        <div className="flex items-center justify-center w-12 h-12 p-5 text-white rounded-full bg-primary">
          {toFixed((examResult?.score * 20) / 100, 1)}
        </div>
        <p className="text-xl font-bold uppercase">valores</p>
      </div>

      <section className="relative flex flex-col items-center justify-center px-4 mt-10 text-center">
        {examResult?.passed ? (
          <>
            <p className="text-xl font-semibold">
              <span className="text-primary">Parabéns!</span> Passaste no exame! 🎉
            </p>
            <p className="max-w-screen-lg px-10 mt-5">
              Contudo, tens de saber que o caminho para o sucesso é feito de pequenos avanços e,
              como tal, não te deves focar apenas neste exame e sim em tentar fazer o máximo
              possível.
            </p>
            <p className="semibold">Bom trabalho!</p>
            <ReactCanvasConfetti
              particleCount={150}
              fire={fire}
              origin={{ y: 0.9 }}
              className="fixed z-50 w-full h-full"
            />
          </>
        ) : (
          <>
            <p className="text-xl font-semibold">
              <span className="text-primary">Ohhh...</span> reprovaste no exame... 😔
            </p>
            <p className="mt-5">
              Mas hey, não te preocupes! O caminho faz-se caminhando, e tu ainda tens muito pela
              frente para poderes responder! Eu acredito em ti!
            </p>
            <p className="semibold">Continua!</p>
          </>
        )}
        <PrimaryButton onClick={handleReview} className="z-50 mt-16 mb-4">
          Verificar respostas
        </PrimaryButton>
        {!token && (
          <p className="z-50 mx-5 mt-5 text-xs">
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
