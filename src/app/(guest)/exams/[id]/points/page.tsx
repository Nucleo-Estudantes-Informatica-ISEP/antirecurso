'use client';

import { useContext, useEffect, useState } from 'react';

import Link from 'next/link';

import PrimaryButton from '@/components/PrimaryButton';
import { ExamContext } from 'src/contexts/ExamContext';

import { useRouter } from 'next/navigation';
import ReactCanvasConfetti from 'react-canvas-confetti';
import useToken from 'src/hooks/useToken';
import swal from 'sweetalert';

interface ExamPageProps {
  params: {
    id: string;
  };
}

const points: React.FC<ExamPageProps> = ({ params }) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>();

  const { examResult, subject } = useContext(ExamContext);

  if (!examResult) {
    swal({
      title: 'Erro',
      text: 'Não foi possível obter o resultado do exame.',
      icon: 'error'
    });

    router.push('/');
    return <></>;
  }

  function handleReview() {
    router.push('/exams/' + examResult!.id + '/review');
  }

  const [fire, setFire] = useState(false);

  async function getToken() {
    const token = await useToken();
    setToken(token);
  }

  useEffect(() => {
    setFire(true);
    getToken();
  }, []);

  return (
    <section className="h-screen flex flex-col items-center mt-4">
      <p className="text-xl font-bold uppercase md:mt-60 ml-5">
        Exame de <span className="text-primary">{subject}</span>
      </p>
      <div className="flex items-center justify-center mt-10 space-x-3">
        <div className="text-white bg-primary p-5 w-8 h-8 flex items-center justify-center rounded-full">
          {examResult?.score}
        </div>
        <p className="text-xl font-bold uppercase">pontos</p>
      </div>

      <section className="mt-10 px-4 flex text-center flex-col items-center justify-center relative">
        {examResult?.passed ? (
          <>
            <p className="font-semibold text-xl">
              <span className="text-primary">Parabéns!</span> Passaste no exame! 🎉
            </p>
            <p className="px-10 max-w-screen-lg mt-5">
              Contudo, tens de saber que o caminho para o sucesso é feito de pequenos avanços e,
              como tal, não te deves focar apenas neste exame e sim em tentar fazer o máximo
              possível.
            </p>
            <p className="semibold">Bom trabalho!</p>
            <ReactCanvasConfetti
              particleCount={150}
              fire={fire}
              origin={{ y: 0.9 }}
              className="fixed w-full h-full z-50"
            />
          </>
        ) : (
          <>
            <p className="font-semibold text-xl">
              <span className="text-primary">Ohhh...</span> reprovaste no exame... 😔
            </p>
            <p className="mt-5">
              Mas hey, não te preocupes! O caminho faz-se caminhando, e tu ainda tens muito pela
              frente para poderes responder! Eu acredito em ti!
            </p>
            <p className="semibold">Continua!</p>
          </>
        )}
        <PrimaryButton onClick={handleReview} className="mt-16 mb-4 z-50">
          Verificar respostas
        </PrimaryButton>
        {!token && (
          <p className="text-xs mt-5 mx-5">
            Não te esqueças que podes criar uma conta para guardar o teu progresso clicando{' '}
            <Link className="cursor-pointer underline" href="/register">
              aqui
            </Link>
            .
          </p>
        )}
      </section>
    </section>
  );
};

export default points;
