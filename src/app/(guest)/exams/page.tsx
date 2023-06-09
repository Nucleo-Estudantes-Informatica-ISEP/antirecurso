import Link from 'next/link';

import { fetchSubjects } from 'src/services';

// @ts-expect-error Server Component
const Exams: React.FC = async () => {
  const subjects = await fetchSubjects();

  return (
    <section className="min-h-screen my-12 flex flex-col items-center justify-center text-center">
      <p className="text-xl font-bold uppercase text-center">
        <span className="text-primary">Escolhe</span> uma disciplina para fazer{' '}
        <span className="text-primary">o exame</span>
      </p>

      <section className="grid md:grid-cols-4 gap-y-10 md:gap-x-10 mt-10 md:px-16">
        {subjects.map((subject) => (
          <Link
            href={`exams/${subject.id}/answer`}
            key={subject.id}
            className="w-full md:h-48 p-5 flex flex-col space-y-5 items-center justify-center shadow border border-gray-100 rounded text-center group hover:bg-primary transition ease-in-out">
            <p className="w-3/4 font-bold uppercase group-hover:text-white">{subject.name}</p>
            <p className="uppercase group-hover:text-white">({subject.slug})</p>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default Exams;
