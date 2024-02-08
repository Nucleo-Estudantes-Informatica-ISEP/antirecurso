'use client';

import useSession from '@/hooks/useSession';
import { fetchSubjects } from '@/services';
import Subject from '@/types/Subject';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Exams: React.FC = () => {
  const { token: session } = useSession();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    async function getSubjects() {
      const subjects = await fetchSubjects();
      setSubjects(subjects);
    }

    getSubjects();
  }, []);

  return (
    <section className="flex flex-col items-center justify-between py-8 w-full text-center px-8">
      <section className="flex flex-col items-center justify-center w-full text-center">
        <p className="w-5/6 px-4 text-lg font-bold text-center uppercase md:text-xl my-5">
          <span className="text-primary">Escolhe</span> uma disciplina para ver os seus{' '}
          <span className="text-primary">resumos</span>
        </p>

        {subjects ? (
          <section className="grid grid-cols-2 gap-x-4 px-6 md:grid-cols-4 gap-y-10 md:gap-x-10 my-8 md:px-16">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className={`relative w-full h-full md:h-48 p-6 flex flex-col space-y-6 items-center justify-center shadow dark:shadow-secondary-dark border border-gray-100 rounded text-center group ${
                  session
                    ? 'hover:bg-primary transition ease-in-out'
                    : 'pointer-events-none opacity-50'
                }`}>
                <Link
                  key={subject.id}
                  href={`/notes/${subject.id}`}
                  className="w-full h-full md:h-48 min-w-[160px] flex flex-col space-y-6 items-center justify-center text-center group transition ease-in-out">
                  <div className="w-full justify-center items-center overflow-auto">
                    <p className="w-full text-xs md:text-xl font-bold capitalize line-clamp-6 group-hover:text-white">
                      {subject.name}
                    </p>
                    <p className="text-xs mt-4 uppercase group-hover:text-white">
                      ({subject.slug})
                    </p>
                  </div>
                </Link>
                {!session && (
                  <div className="absolute left-0 w-full p-1 text-xs font-bold text-white bg-red-500 md:text-base -top-2 md:-right-8 md:p-2">
                    <p>Conta necessária 🔒</p>
                  </div>
                )}
              </div>
            ))}
          </section>
        ) : (
          <div className="flex flex-col gap-y-8">
            <p className="md:text-lg w-full">A carregar disciplinas...</p>
          </div>
        )}
      </section>

      <div className="flex flex-col gap-y-8">
        <p className="md:text-lg w-full">
          Queres ajudar os teus colegas a prepararem-se para os exames? Envia-nos o teus
          <span className="text-primary font-bold"> resumos</span> para{' '}
          <a className="underline text-primary" href="mailto:support.antirecurso@nei-isep.org">
            support.antirecurso@nei-isep.org
          </a>
          .
        </p>
      </div>

      <div />
    </section>
  );
};

export default Exams;
