'use client';

import Score from 'src/types/Score';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ScoreboardPodiumProps {
  scores: Score[];
  uid?: number;
}

const ScoreboardPodium: React.FC<ScoreboardPodiumProps> = ({ scores, uid }) => {
  const badges = [
    '/images/podium/gold-small.svg',
    '/images/podium/silver-small.svg',
    '/images/podium/bronze-small.svg'
  ];

  const hoverMotion = {
    initial: {
      y: 0,
      scale: 1
    },
    hover: {
      y: -10,
      scale: 1.02,
      delay: 0
    }
  };

  const youMotion = {
    initial: { opacity: 0, top: -56 },
    hover: { opacity: 1, top: -32 }
  };

  return (
    <div
      className="grid grid-cols-3 items-start mb-6 mt-2"
      style={{ gridTemplateAreas: `"p2 p1 p3"` }}>
      {scores.slice(0, 3).map((score, key) => (
        <motion.div
          initial="initial"
          whileHover="hover"
          variants={hoverMotion}
          transition={{
            duration: 0.2
          }}
          key={key}
          className={`flex flex-col items-center px-8 md:px-14 rounded-t-2xl ${
            key == 0
              ? 'py-12 md:pb-24 bg-gradient-to-b from-primary to-transparent z-10'
              : 'mt-12 pt-12 md:pb-12' //hover:bg-gradient-to-b to-transparent transition-colors duration-200 ease-in-out'
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
              className="w-8 rounded-full aspect-square absolute right-[-.5rem] top-[-.5rem] md:right-0 md:top-0"
              src={badges[key]}
              alt="Badge"
              width={80}
              height={80}
            />
            {score.user_id == uid && (
              <motion.div
                className="-z-10 w-28 md:w-32 text-center text-xs md:text-sm rounded-full bg-orange-400 absolute left-1/2 -translate-x-1/2"
                variants={youMotion}
                transition={{
                  duration: 0.2,
                  ease: 'easeOut'
                }}>
                Estás no pódio!
              </motion.div>
            )}
          </div>
          <div className="flex flex-col items-center py-4 text-center max-w-min">
            <p className="text-lg md:text-2xl font-bold leading-5">{score.user_name}</p>
            <p className="text-lg md:text-2xl font-bold mt-1">{score.score}</p>
            <p className="text-sm md:text-lg font-normal text-gray-600 whitespace-nowrap">
              {score.exams} exames
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ScoreboardPodium;
