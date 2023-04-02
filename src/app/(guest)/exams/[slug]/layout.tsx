interface ExamPageProps {
  params: {
    slug: string;
  };
  children: React.ReactNode;
}

const ExamAnswerLayout: React.FC<ExamPageProps> = ({ params, children }) => {
  const subjectName = getSubjectName(params.slug);

  function getSubjectName(slug: string) {
    // TODO get subject name from slug
    return 'Princípios da Computação';
  }

  return (
    <section className="h-screen flex flex-col items-center">
      <p className="text-xl font-bold uppercase mt-10 ml-5">
        Exame de <span className="text-primary">{subjectName}</span>
      </p>
      <section>{children}</section>
    </section>
  );
};

export default ExamAnswerLayout;
