import Link from 'next/link';

// @ts-expect-error Server Component
const Exams: React.FC = async () => {
  // mock
  const courses = [
    {
      name: 'Licenciatura em Engenharia Biomédica',
      code: 'leb'
    },
    {
      name: 'Licenciatura em Engenharia Civil',
      code: 'lec'
    },
    {
      name: 'Licenciatura em Engenharia de Sistemas',
      code: 'les'
    },
    {
      name: 'Licenciatura em Engenharia de Telecomunicações e Informática',
      code: 'leti'
    },
    {
      name: 'Licenciatura em Engenharia e Gestão Industrial',
      code: 'legi'
    },
    {
      name: 'Licenciatura em Engenharia Informática',
      code: 'lei'
    },
    {
      name: 'Mestrado em Engenharia Informática',
      code: 'mei'
    },
    {
      name: 'Mestrado em Engenharia de Sistemas Computacionais Críticos',
      code: 'mescc'
    },
    {
      name: 'Mestrado em Engenharia Mecânica',
      code: 'mescc'
    },
    {
      name: 'Mestrado em Engenharia Química',
      code: 'mescc'
    }
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="flex flex-col items-center justify-center w-full text-center">
      <p className="w-5/6 px-4 text-lg font-bold text-center uppercase md:text-xl my-5">
        <span className="text-primary">Escolhe</span> o teu{' '}
        <span className="text-primary">curso</span>
      </p>

      <section className="grid grid-cols-2 gap-x-4 px-6 md:grid-cols-4 gap-y-10 md:gap-x-10 my-8 md:px-16">
        {courses.map((course) => (
          <Link
            key={course.code}
            href={`/exams`}
            className="w-full h-full min-w-[180px] md:h-48 p-6 flex flex-col space-y-6 items-center justify-center shadow dark:shadow-secondary-dark border border-gray-100 rounded text-center group hover:bg-primary transition ease-in-out">
            <div className="w-full justify-center items-center overflow-auto">
              <p className="w-full text-xs md:text-xl font-bold line-clamp-6 group-hover:text-white">
                {course.name}
              </p>
              {/* <p className="text-xs mt-4 uppercase group-hover:text-white">({course.slug})</p> */}
            </div>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default Exams;
