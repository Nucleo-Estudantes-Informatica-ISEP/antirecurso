interface ExamPageProps {
  params: {
    slug: string;
  };
}

const Exam: React.FC<ExamPageProps> = ({ params }) => {
  return (
    <div>
      <span>{params.slug} exam</span>
    </div>
  );
};

export default Exam;
