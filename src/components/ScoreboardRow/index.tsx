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
      className={`text-lg md:text-xl font-bold max-w-fit group
        [&>*]:transition-colors [&>*]:duration-200 [&>*]:ease-in-out
        ${highlight ?? 'bg-orange-200 dark:bg-orange-800'}`}
      key={line.user_id}>
      <th
        scope="row"
        className="py-3 pl-6 pr-6 rounded-l-full md:pl-16 whitespace-nowrap group-hover:bg-gray-100 dark:group-hover:bg-cool-gray-700">
        {position}
      </th>
      <td className="md:pl-4 py-2 min-w-[3.5rem] group-hover:bg-gray-100 dark:group-hover:bg-cool-gray-700">
        <Image
          className="w-9 rounded-full aspect-square"
          src={`https://gravatar.com/avatar/${line.avatar}?s=64&d=identicon`}
          alt={line.user_name}
          loading="lazy"
          width={64}
          height={64}
          unoptimized
        />
      </td>
      <td className="md:px-4 py-2 md:min-w-[32rem] group-hover:bg-gray-100 dark:group-hover:bg-cool-gray-700">
        <div className="flex flex-col items-start text-left">
          <span className="text-lg leading-5">{line.user_name}</span>
          <span className="text-sm font-normal leading-3 text-gray-600 dark:text-gray-300">
            {line.exams} exames
          </span>
        </div>
      </td>
      <td className="px-6 py-2 rounded-r-full md:pr-16 group-hover:bg-gray-100 dark:group-hover:bg-cool-gray-700">
        {line.score}
      </td>
    </motion.tr>
  );
};

export default ScoreboardRow;
