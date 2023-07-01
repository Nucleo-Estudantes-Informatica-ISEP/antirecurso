import Link from 'next/link';

import { fetchSubjects } from 'src/services';

// @ts-expect-error Server Component
const Exams: React.FC = async () => {
  const subjects = await fetchSubjects();

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-full text-center">
      <p className="w-5/6 px-4 text-lg font-bold text-center uppercase md:text-xl">
        <span className="text-primary">Escolhe</span> uma disciplina para fazer{' '}
        <span className="text-primary">o exame</span>
      </p>

      <section className="grid grid-cols-2 px-6 mt-10 gap-x-4 md:grid-cols-4 gap-y-10 md:gap-x-10 md:px-16">
        {subjects.map((subject) => (
          <Link
            href={`exams/${subject.id}/answer`}
            key={subject.id}
            className="flex flex-col items-center justify-center w-full h-full p-5 space-y-6 text-center transition ease-in-out border border-gray-100 rounded shadow md:h-48 group hover:bg-primary">
            <div className="items-center justify-center w-full overflow-auto">
              <p className="w-full text-xs font-bold capitalize md:text-xl line-clamp-6 group-hover:text-white">
                {subject.name}
              </p>
              <p className="w-full mt-4 text-xs uppercase group-hover:text-white">
                ({subject.slug})
              </p>
            </div>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default Exams;
