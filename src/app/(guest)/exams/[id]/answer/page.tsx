import Link from 'next/link';

interface ExamAnswerPageProps {
  params: {
    id: string;
  };
}

const modes = [
  {
    id: 1,
    name: 'Modo Aleatório',
    description:
      'Resolve um exame com um conjunto aleatório de todas as perguntas que temos disponíveis!',
    slug: 'default',
    icon: '🎲'
  },
  {
    id: 2,
    name: 'Modo Realista',
    description:
      'Desafia-te em condições de exame. Resolve um exame com o número de questões e opções aproximadas às do exame real!',
    slug: 'realistic',
    icon: '📝'
  },
  {
    id: 3,
    name: 'Modo Novas Perguntas',
    description:
      'Resolve um exame com perguntas que nunca resolveste antes. Ideal para treinar para o exame!',
    slug: 'new',
    icon: '🆕',
    comingSoon: true
  },
  {
    id: 4,
    name: 'Modo Perguntas Erradas',
    description:
      'Resolve um exame com perguntas que erraste anteriormente. Ideal para perceberes onde tens de melhorar!',
    slug: 'wrong',
    icon: '❌',
    comingSoon: true
  }
];

// @ts-expect-error Server Component
const Exams: React.FC<ExamAnswerPageProps> = async ({ params }) => {
  return (
    <section className="h-full w-full flex flex-col items-center justify-center text-center">
      <p className="text-lg w-5/6 md:text-xl font-bold uppercase text-center px-4">
        <span className="text-primary">Escolhe</span> o <span className="text-primary">modo</span>{' '}
        de perguntas do teu <span className="text-primary">exame</span>
      </p>

      <section className="grid grid-cols-2 gap-x-4 px-6 md:grid-cols-4 gap-y-10 md:gap-x-10 mt-10 md:px-16">
        {modes.map((mode) => (
          <Link
            href={`exams/${params.id}/answer?mode=${mode.slug}`}
            key={mode.id}
            // disable if coming comingSoon
            className={`relative w-full h-full md:h-64 p-5 flex flex-col space-y-6 items-center justify-center shadow border border-gray-100 rounded text-center group hover:bg-primary transition ease-in-out ${
              mode.comingSoon ? 'pointer-events-none opacity-50' : ''
            }`}>
            <p className="text-5xl">{mode.icon}</p>
            {mode.comingSoon && (
              <>
                <div className="bg-orange-500 rotate-45 absolute top-0 -right-8 text-white font-bold p-2">
                  <p>Coming Soon</p>
                </div>
              </>
            )}
            <div className="w-full justify-center items-center overflow-auto">
              <p className="w-full text-xs md:text-xl font-bold line-clamp-6 group-hover:text-white">
                {mode.name}
              </p>
              <p className="w-full text-base mt-4 group-hover:text-white">{mode.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default Exams;
