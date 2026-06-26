const STORAGE_PREFIX = 'exam-shuffle-';

export function getShuffleSeed(examId: string | number): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`${STORAGE_PREFIX}${examId}`);
}

export function setShuffleSeed(examId: string | number, seed: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_PREFIX}${examId}`, seed);
}

export function shuffleWithSeed<T>(array: T[], seed: string): T[] {
  const result = [...array];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }

  const rand = () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function reorderByIds<T extends { id: number | string }>(
  array: T[],
  orderedIds: (number | string)[]
): T[] {
  const map = new Map(array.map((item) => [item.id, item]));
  return orderedIds
    .map((id) => map.get(id))
    .filter((item): item is T => Boolean(item));
}

export function generateSeed(): string {
  return `seed-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
