interface ScoreboardPageProps {
  params: {
    slug: string;
  };
}

const ScoreboardPage: React.FC<ScoreboardPageProps> = ({ params }) => {
  return (
    <div>
      <span>{params.slug} scoreboard</span>
    </div>
  );
};

export default ScoreboardPage;
