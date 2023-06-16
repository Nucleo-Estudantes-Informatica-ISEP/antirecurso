const about: React.FC = () => {
  return (
    <section className="flex flex-col items-center text-center mt-32 space-y-10">
      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Sponsored by</p>
        <p className="text-primary font-semibold">
          <a href="https://www.nei-isep.org/" target="_blank">
            NEI-ISEP
          </a>
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Data Mining by</p>
        <p className="text-primary font-semibold">
          <a href="mailto:1211289@isep.ipp.pt" target="_blank">
            Tomás Lopes
          </a>
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Git repository </p>
        <p className="text-primary font-semibold">
          <a
            href="https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso"
            target="_blank">
            https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso
          </a>
        </p>
      </div>
    </section>
  );
};

export default about;
