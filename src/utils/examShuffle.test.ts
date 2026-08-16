import { describe, expect, it } from 'vitest';

import { reorderByIds, shuffleWithSeed } from './examShuffle';

describe('exam shuffle', () => {
  it('produces a stable permutation without mutating the questions', () => {
    const questions = [1, 2, 3, 4, 5];

    expect(shuffleWithSeed(questions, 'exam-42')).toEqual(shuffleWithSeed(questions, 'exam-42'));
    expect(questions).toEqual([1, 2, 3, 4, 5]);
  });

  it('restores the saved question order and ignores unknown ids', () => {
    const questions = [{ id: 1 }, { id: 2 }, { id: 3 }];

    expect(reorderByIds(questions, [3, 99, 1])).toEqual([{ id: 3 }, { id: 1 }]);
  });
});
