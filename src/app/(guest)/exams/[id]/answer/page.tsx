import getServerSession from '@/services/getServerSession';
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
    icon: '📝',
    needsAuth: true
  },
  {
    id: 3,
    name: 'Modo Novas Perguntas',
    description:
      'Resolve um exame com perguntas que nunca resolveste antes. Ideal para treinar para o exame!',
    slug: 'new',
    icon: '🆕',
    needsAuth: true
  },
  {
    id: 4,
    name: 'Modo Perguntas Erradas',
    description:
      'Resolve um exame com perguntas que erraste anteriormente. Ideal para perceberes onde tens de melhorar!',
    slug: 'wrong',
    icon: '❌',
    needsAuth: true,
    comingSoon: false
  },
  {
    id: 5,
    name: 'Modo Perguntas Difíceis',
    description: 'Desafia-te com as perguntas mais erradas por todos os estudantes!',
    slug: 'hard',
    icon: '🤯',
    needsAuth: true,
    comingSoon: true
  },
  {
    id: 6,
    name: 'Modo Duelo',
    description: 'Desafia um amigo para descobrir quem acerta mais perguntas!',
    slug: 'duel',
    icon: '👥',
    needsAuth: true,
    comingSoon: true
  },
  {
    id: 7,
    name: 'Modo Personalizado',
    description: 'Cria um exame com as características que quiseres!',
    slug: 'custom',
    icon: '⚙️',
    needsAuth: true,
    comingSoon: true
  }
];

// @ts-expect-error Server Component
const Exams: React.FC<ExamAnswerPageProps> = async ({ params }) => {
  const session = await getServerSession();

  return (
    <section className="flex flex-col items-center justify-center w-full text-center mb-8">
      <p className="w-5/6 px-4 text-lg font-bold text-center uppercase md:text-xl">
        <span className="text-primary">Escolhe</span> o <span className="text-primary">modo</span>{' '}
        de perguntas do teu <span className="text-primary">exame</span>
      </p>

      <section className="grid px-6 mt-12 gap-x-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 md:gap-x-10 md:px-16">
        {modes.map((mode) => (
          <Link
            href={`exams/${params.id}/answer/${mode.slug}`}
            key={mode.id}
            className={`relative w-full h-full md:h-64 p-5 flex flex-col space-y-6 items-center justify-center shadow dark:shadow-gray-500 rounded text-center group hover:bg-primary transition ease-in-out ${
              mode.comingSoon || (mode.needsAuth && !session)
                ? 'pointer-events-none opacity-50'
                : ''
            }`}>
            <p className="text-5xl">{mode.icon}</p>
            {mode.comingSoon ? (
              <div className="absolute top-0 p-1 text-xs font-bold text-white rotate-45 bg-orange-500 md:text-base -right-4 md:-right-8 md:p-2">
                <p>Coming Soon</p>
              </div>
            ) : (
              mode.needsAuth &&
              !session && (
                <div className="absolute left-0 w-full p-1 text-xs font-bold text-white bg-red-500 md:text-base -top-4 md:-right-8 md:p-2">
                  <p>Needs account 🔒</p>
                </div>
              )
            )}
            <div className="items-center justify-center w-full overflow-auto">
              <p className="w-full text-xs font-bold md:text-xl line-clamp-6 group-hover:text-white">
                {mode.name}
              </p>
              <p className="w-full mt-4 text-base group-hover:text-white">{mode.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default Exams;
