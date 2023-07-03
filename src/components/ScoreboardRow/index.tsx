'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Score from 'src/types/Score';

interface ScoreboardRowProps {
  line: Score;
  position: number;
  highlight?: boolean;
}

const ScoreboardRow: React.FC<ScoreboardRowProps> = ({ line, position, highlight }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      className={`${
        highlight ? 'bg-orange-200' : 'hover:bg-gray-100'
      } text-lg md:text-xl font-bold transition-colors duration-200 ease-in-out max-w-fit`}
      key={line.user_id}>
      <th scope="row" className="pl-6 md:pl-16 pr-6 py-3 whitespace-nowrap rounded-l-full">
        {position}
      </th>
      <td className="md:pl-4 py-2 min-w-[3.5rem]">
        <Image
          className="w-9 rounded-full aspect-square"
          src={`https://gravatar.com/avatar/${line.avatar}?s=64&d=identicon`}
          alt={line.user_name}
          loading="lazy"
        />
      </td>
      <td className="md:px-4 py-2 md:min-w-[32rem]">
        <div className="flex flex-col items-start text-left">
          <span className="text-lg leading-5">{line.user_name}</span>
          <span className="text-sm leading-3 font-normal text-gray-600">{line.exams} exames</span>
        </div>
      </td>
      <td className="px-6 md:pr-16 py-2 rounded-r-full">{line.score}</td>
    </motion.tr>
  );
};

export default ScoreboardRow;
