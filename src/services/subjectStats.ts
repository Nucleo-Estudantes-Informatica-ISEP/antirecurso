import { useTranslations as translate, type Lang } from '@/i18n/translations';
import type { SubjectStats } from '@/types/SubjectStats';
import { apiRequest } from './apiClient';

export type SubjectStatsViewModel = {
  averageGrade: number;
  questionsSeen: number;
  questionsSeenPercentage: number;
  questionBreakdown: [number, number, number];
  meanTimeLabel: string;
};

export async function fetchSubjectStats(
  subjectId: number,
  lang: Lang = 'pt'
): Promise<SubjectStats> {
  return apiRequest<SubjectStats>(`subjects/${subjectId}/stats`, {
    authenticated: true,
    errorMessage: translate(lang)('error.loadStats')
  });
}

export function getSubjectStatsViewModel(
  stats: SubjectStats,
  lang: Lang = 'pt'
): SubjectStatsViewModel {
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
    meanTimeLabel: formatDuration(stats.mean_time, lang)
  };
}

function formatDuration(seconds: number | null, lang: Lang): string {
  const t = translate(lang);
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return t('stats.noTime');

  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainder = wholeSeconds % 60;
  return `${minutes > 0 ? `${minutes} ${t(minutes === 1 ? 'stats.minute' : 'stats.minutes')} ${t('common.and')} ` : ''}${remainder} ${t(remainder === 1 ? 'stats.second' : 'stats.seconds')}`;
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
