import Link from 'next/link';

import PrimaryButton from '@/components/utils/PrimaryButton';

const Hero: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full text-center text-white bg-center bg-no-repeat bg-cover bg-hero">
      <section className="flex flex-col items-center justify-center text-center text-white">
        <p className="px-10 text-4xl font-bold uppercase md:px-0">
          <span className="text-primary">Queres</span> mesmo ir a{' '}
          <span className="text-primary">recurso</span>?
        </p>
        <p className="mt-5 text-lg">
          Para quê fazer isso quando tens o{' '}
          <span className="font-bold">
            <span className="text-primary">Anti</span>Recurso
          </span>
          ?
        </p>

        <Link href="/exams" className="mt-10">
          <PrimaryButton>Resolver exames</PrimaryButton>
        </Link>
      </section>
    </div>
  );
};

export default Hero;
