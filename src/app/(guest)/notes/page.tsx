const Exams: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-between py-8 w-full text-center px-8">
      <p className="w-5/6 px-4 text-3xl font-bold text-center uppercase md:text-4xl my-5">
        Resumos
      </p>

      <div className="flex flex-col gap-y-8">
        <h2 className="text-4xl md:text-7xl font-black text-primary">Coming Soon...</h2>

        <p className="md:text-lg w-full">
          Queres ajudar os teus colegas a prepararem-se para os exames? Envia-nos o teus
          <span className="text-primary font-bold"> resumos</span> para{' '}
          <a className="underline text-primary" href="mailto:support.antirecurso@nei-isep.org">
            support.antirecuso@nei-isep.org
          </a>
          . Temos surpresas preparadas para ti!
        </p>
      </div>

      <div />
    </section>
  );
};

export default Exams;
