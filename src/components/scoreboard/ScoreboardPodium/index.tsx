'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import Score from 'src/types/Score';

interface ScoreboardPodiumProps {
  scores: Score[];
  uid?: number;
}

const podiumConfig = [
  {
    label: '1.º',
    medal: '🥇',
    cardClass:
      'bg-gradient-to-b from-amber-400/30 via-amber-400/10 to-transparent border-amber-400/40',
    badgeClass: 'bg-amber-500 text-white',
    ringClass: 'ring-4 ring-amber-500/30',
    grid: 'p1',
    height: 'pb-8 md:pb-16'
  },
  {
    label: '2.º',
    medal: '🥈',
    cardClass: 'bg-gradient-to-b from-slate-400/20 to-transparent border-slate-400/30',
    badgeClass: 'bg-slate-400 text-white',
    ringClass: 'ring-4 ring-slate-400/30',
    grid: 'p2',
    height: 'pb-6 md:pb-10 mt-6'
  },
  {
    label: '3.º',
    medal: '🥉',
    cardClass: 'bg-gradient-to-b from-orange-700/20 to-transparent border-orange-700/30',
    badgeClass: 'bg-orange-700 text-white',
    ringClass: 'ring-4 ring-orange-700/30',
    grid: 'p3',
    height: 'pb-6 md:pb-10 mt-6'
  }
];

const ScoreboardPodium: React.FC<ScoreboardPodiumProps> = ({ scores, uid }) => {
  const ordering = [scores[1], scores[0], scores[2]].filter(Boolean);
  const orderedConfig = [podiumConfig[1], podiumConfig[0], podiumConfig[2]];

  return (
    <div className="grid grid-cols-3 items-end max-w-3xl mx-auto gap-2 md:gap-4">
      {ordering.map((score, idx) => {
        if (!score) return <div key={idx} />;
        const cfg = orderedConfig[idx];
        const userInitials = score.user_name
          ? score.user_name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
          : '';
        const isYou = score.user_id === uid;

        return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            key={score.user_id}
            className={cn(
              'relative flex flex-col items-center rounded-2xl border pt-6 md:pt-8 px-2 md:px-4 text-center',
              cfg.cardClass,
              cfg.height
            )}
          >
            {isYou && (
              <Badge variant="default" className="absolute -top-3 left-1/2 -translate-x-1/2">
                Estás no pódio!
              </Badge>
            )}
            <div className="relative">
              <Avatar
                className={cn(
                  'size-16 md:size-24',
                  cfg.ringClass
                )}
              >
                <AvatarImage
                  src={`https://gravatar.com/avatar/${score.avatar}?s=160&d=identicon`}
                  alt={score.user_name}
                />
                <AvatarFallback className="text-base md:text-xl font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center size-7 md:size-8 rounded-full text-xs font-bold border-2 border-background shadow',
                  cfg.badgeClass
                )}
              >
                {cfg.label}
              </div>
            </div>
            <div className="mt-5 flex flex-col items-center">
              <p className="text-sm md:text-base font-semibold leading-tight line-clamp-2">
                {score.user_name}
              </p>
              <div className="mt-1 flex items-center gap-1">
                <Trophy className="size-3.5 md:size-4 text-primary" />
                <p className="text-lg md:text-2xl font-bold text-primary">{score.score}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {score.exams} {score.exams === 1 ? 'exame' : 'exames'}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ScoreboardPodium;
