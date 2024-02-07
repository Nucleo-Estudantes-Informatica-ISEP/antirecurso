import Link from 'next/link';

import { fetchSubjects } from 'src/services';

// @ts-expect-error Server Component
const Exams: React.FC = async () => {
  const subjects = await fetchSubjects();

  return (
    <section className="flex flex-col items-center justify-center w-full text-center">
      <p className="w-5/6 px-4 text-lg font-bold text-center uppercase md:text-xl my-5">
        <span className="text-primary">Escolhe</span> uma disciplina para fazer um{' '}
        <span className="text-primary">exame</span>
      </p>

      <section className="grid grid-cols-2 gap-x-4 px-6 md:grid-cols-4 gap-y-10 md:gap-x-10 my-8 md:px-16">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/exams/${subject.id}/answer`}
            className="w-full h-full min-w-[180px] md:h-48 p-6 flex flex-col space-y-6 items-center justify-center shadow dark:shadow-secondary-dark border border-gray-100 rounded text-center group hover:bg-primary transition ease-in-out">
            <div className="w-full justify-center items-center overflow-auto">
              <p className="w-full text-xs md:text-xl font-bold capitalize line-clamp-6 group-hover:text-white">
                {subject.name}
              </p>
              <p className="text-xs mt-4 uppercase group-hover:text-white">({subject.slug})</p>
            </div>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default Exams;
