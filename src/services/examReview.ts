export function getOwnedExamReviewPath(examId: string, accessToken: string | null): string | null {
  const normalizedExamId = examId.trim();

  if (!accessToken || !/^\d+$/.test(normalizedExamId)) return null;

  return `/exams/${normalizedExamId}`;
}
