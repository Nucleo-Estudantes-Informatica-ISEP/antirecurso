const About: React.FC = () => {
  return (
    <section className="h-full flex flex-col items-center justify-center text-center space-y-10">
      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Made by</p>
        <p className="text-primary font-semibold">
          <a href="https://www.nei-isep.org/" rel="noreferrer" target="_blank">
            NEI-ISEP
          </a>
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Data Mining by</p>
        <p className="text-primary font-semibold">
          <a href="https://github.com/tomasflopes" rel="noreferrer" target="_blank">
            Tomás Lopes
          </a>
        </p>
      </div>

      <div className="space-y-3 w-5/6">
        <p className="text-xl font-semibold uppercase">Git repository </p>
        <p className="text-primary font-semibold w-full">
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
