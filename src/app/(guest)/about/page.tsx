const About: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full space-y-10 text-center">
      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Made by</p>
        <p className="font-semibold text-primary">
          <a href="https://www.nei-isep.org/" rel="noreferrer" target="_blank">
            NEI-ISEP
          </a>
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Data Mining by</p>
        <p className="font-semibold text-primary">
          <a href="https://github.com/tomasflopes" rel="noreferrer" target="_blank">
            Tomás Lopes
          </a>
        </p>
      </div>

      <div className="w-5/6 space-y-3">
        <p className="text-xl font-semibold uppercase">Git repository </p>
        <p className="w-full font-semibold text-primary">
          <a
            rel="noreferrer"
            href="https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso"
            target="_blank">
            https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso
          </a>
        </p>
      </div>
    </section>
  );
};

export default About;
