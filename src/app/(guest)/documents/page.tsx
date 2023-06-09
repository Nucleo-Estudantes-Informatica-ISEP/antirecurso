const documents: React.FC = () => {
  return (
    <section className="flex flex-col items-center text-center mt-32 space-y-10">
      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Made with ❤️ by</p>
        <p className="text-primary font-semibold">Miguel Ferreira</p>
      </div>

      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Data mining by</p>
        <p className="text-primary font-semibold">Tomás Lopes</p>
      </div>

      <div className="space-y-3">
        <p className="text-xl font-semibold uppercase">Sponsored by</p>
        <p className="text-primary font-semibold">NEI ISEP</p>
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

export default documents;
