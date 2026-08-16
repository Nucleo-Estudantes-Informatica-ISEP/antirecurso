import type { SubjectStats } from '@/types/SubjectStats';

export type SubjectStatsViewModel = {
  averageGrade: number;
  questionsSeen: number;
  questionsSeenPercentage: number;
  questionBreakdown: [number, number, number];
  meanTimeLabel: string;
};

export function getSubjectStatsViewModel(stats: SubjectStats): SubjectStatsViewModel {
  const totalQuestions = nonNegative(stats.total_of_questions);
  const questionsSeen = clamp(nonNegative(stats.n_of_answered), 0, totalQuestions);
  const wrong = clamp(nonNegative(stats.n_of_wrong_answers), 0, questionsSeen);
  const correct = clamp(nonNegative(stats.n_of_correct), 0, questionsSeen - wrong);
  const unseen = Math.max(0, totalQuestions - questionsSeen);
  const averageGrade = clamp(finiteOrZero(stats.average_grade), 0, 100);
  const questionsSeenPercentage =
    totalQuestions === 0 ? 0 : Number(((questionsSeen / totalQuestions) * 100).toFixed(1));

  return {
    averageGrade,
    questionsSeen,
    questionsSeenPercentage,
    questionBreakdown: [correct, wrong, unseen],
    meanTimeLabel: formatDuration(stats.mean_time)
  };
}

function formatDuration(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return 'sem dados suficientes';

  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainder = wholeSeconds % 60;
  return `${minutes > 0 ? `${minutes} minutos e ` : ''}${remainder} segundos`;
}

function finiteOrZero(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function nonNegative(value: number): number {
  return Math.max(0, finiteOrZero(value));
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
