'use client';

import PrimaryButton from '@/components/PrimaryButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

interface ExamPageProps {
  params: {
    id: string;
  };
}

const points: React.FC<ExamPageProps> = ({ params }) => {
  function getSubjectName() {
    setSubjectName('Princípios da Programação');
  }

  const [fire, setFire] = useState(false);
  const [points, setPoints] = useState(100);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [subjectName, setSubjectName] = useState('');

  useEffect(() => {
    setFire(true);
    getSubjectName();
  }, []);

  return (
    <section className="h-screen flex flex-col items-center">
      <p className="text-xl font-bold uppercase md:mt-60 ml-5">
        Exame de <span className="text-primary">{subjectName}</span>
      </p>
      <div className="flex items-center justify-center mt-10 space-x-3">
        <div className="text-white bg-primary p-5 w-8 h-8 flex items-center justify-center rounded-full">
          {wrongAnswers}
        </div>
        <p className="text-xl font-bold uppercase">erradas</p>
      </div>

      <section className="mt-10 px-4 flex text-center flex-col items-center justify-center relative">
        {points > 50 ? (
          <>
            <p className="font-semibold text-xl">
              <span className="text-primary">Parabéns!</span> Passaste no exame! 🎉
            </p>
            <p className="mt-5">
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

        <PrimaryButton className="mt-16">Verificar respostas</PrimaryButton>

        <p className="text-xs mt-5 mx-5">
          Não te esqueças que podes criar uma conta para guardar o teu progresso clicando{' '}
          <Link href="/register" className="underline">
            aqui
          </Link>
          .
        </p>
      </section>
    </section>
  );
};

export default points;
