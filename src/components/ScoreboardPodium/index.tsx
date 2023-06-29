import Score from 'src/types/Score';

interface ScoreboardPodiumProps {
  scores: Score[];
}

const ScoreboardPodium: React.FC<ScoreboardPodiumProps> = ({ scores }) => {
  const badges = [
    '/images/podium/gold-small.svg',
    '/images/podium/silver-small.svg',
    '/images/podium/bronze-small.svg'
  ];

  return (
    <div className="grid grid-cols-3 items-start mb-6" style={{ gridTemplateAreas: `"p2 p1 p3"` }}>
      {scores.slice(0, 3).map((score, key) => (
        <div
          key={key}
          className={`flex flex-col items-center px-8 md:px-14 ${
            key == 0
              ? 'bg-gradient-to-b from-primary to-transparent rounded-t-2xl py-12 md:pb-24'
              : 'pt-24 md:pb-12'
          }`}
          style={{ gridArea: `p${key + 1}` }}>
          <div className="relative">
            <img
              className="w-32 rounded-full aspect-square"
              src={`https://gravatar.com/avatar/${score.avatar}?s=128&d=identicon`}
              alt={score.user_name}
              width={128}
              height={128}
            />
            <img
              className="w-8 rounded-full aspect-square absolute right-[-.5rem] top-[-.5rem] md:right-0 md:top-0"
              src={badges[key]}
              alt="Badge"
              width={80}
              height={80}
            />
          </div>
          <div className="flex flex-col items-center py-4 text-center">
            <p className="text-lg md:text-2xl font-bold leading-5">{score.user_name}</p>
            <p className="text-lg md:text-2xl font-bold mt-1">{score.score}</p>
            <p className="text-sm md:text-lg font-normal text-gray-600 whitespace-nowrap">
              {score.exams} exames
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreboardPodium;
