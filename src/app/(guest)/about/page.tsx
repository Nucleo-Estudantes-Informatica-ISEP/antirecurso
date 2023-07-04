import Link from 'next/link';

const About: React.FC = () => {
  return (
    <section className="flex flex-col items-center w-full space-y-10 text-center mt-8">
      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Made by</p>
        <p className="font-semibold text-primary">
          <Link href="https://www.nei-isep.org/" rel="noreferrer" target="_blank">
            NEI-ISEP
          </Link>
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Data Mining by</p>
        <p className="font-semibold text-primary">
          <Link href="https://github.com/tomasflopes" rel="noreferrer" target="_blank">
            Tomás Lopes
          </Link>
        </p>
      </div>

      <div className="w-5/6 space-y-3">
        <p className="text-xl font-semibold uppercase">Git repository </p>
        <p className="w-full font-semibold text-primary">
          <Link
            rel="noreferrer"
            href="https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso"
            target="_blank">
            https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso
          </Link>
        </p>
      </div>

      <div className="w-5/6 space-y-3">
        <p className="text-xl font-semibold uppercase">versions</p>
        <p className="w-full font-semibold text-primary">
          <Link href="/changelog">Check the new features</Link>
        </p>
      </div>
      <div className="h-0.5 w-5/6 bg-primary rounded opacity-70"></div>
      <div className="flex items-center justify-between gap-x-2 w-3/4 md:w-1/2">
        <h1 className="text-xl w-full font-semibold text-center mx-auto">
          Encontraste algum <span className="text-primary">erro</span> ou queres enviar uma{' '}
          <span className="text-primary">resolução</span> de um exame?{' '}
          <span className="text-primary">Fala connosco!</span>
        </h1>
      </div>
      <div className="space-y-3 w-5/6">
        <p className="text-xl font-semibold uppercase">EMAIL</p>
        <p className="text-primary font-semibold">
          <Link href="mailto:support.antirecurso@nei-isep.org" rel="noreferrer" target="_blank">
            support.antirecurso@nei-isep.org
          </Link>
        </p>
      </div>
    </section>
  );
};

export default About;
