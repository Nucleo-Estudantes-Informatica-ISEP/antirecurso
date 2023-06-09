'use client';

import Link from 'next/link';

import PrimaryButton from '../PrimaryButton';

const Hero: React.FC = () => {
  return (
    <div className="bg-hero bg-center bg-no-repeat bg-cover justify-center text-center text-white">
      <section className="h-screen min-w-screen flex flex-col items-center justify-center text-center text-white">
        <p className="text-4xl font-bold uppercase px-10 md:px-0">
          <span className="text-primary">Queres</span> mesmo ir a{' '}
          <span className="text-primary">recurso</span>?
        </p>
        <p className="mt-5 text-lg">
          Para quê fazer isso quando tens o <span className="text-primary">Anti</span>recurso?
        </p>

        <Link href="/exams" className="mt-10">
          <PrimaryButton>Resolver exames</PrimaryButton>
        </Link>
      </section>
    </div>
  );
};

export default Hero;
