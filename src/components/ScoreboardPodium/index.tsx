import Image from 'next/image';
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
          className={`flex flex-col items-center px-14 py-12 ${
            key == 0 ? 'bg-gradient-to-b from-primary to-transparent rounded-t-2xl pb-24' : 'pt-24'
          }`}
          style={{ gridArea: `p${key + 1}` }}>
          <div className="relative">
            <Image
              className="w-32 rounded-full aspect-square"
              src={`https://gravatar.com/avatar/${score.avatar}?s=128&d=identicon`}
              alt={score.user_name}
              width={128}
              height={128}
            />
            <Image
              className="w-8 rounded-full aspect-square absolute right-0 top-0"
              src={badges[key]}
              alt="Badge"
              width={80}
              height={80}
            />
          </div>
          <div className="flex flex-col items-center py-4">
            <p className="text-2xl font-bold">{score.user_name}</p>
            <p className="text-2xl font-bold">{score.score}</p>
            <p className="text-lg font-normal text-gray-600">{score.exams} exames</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreboardPodium;
