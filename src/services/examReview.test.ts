import { describe, expect, it } from 'vitest';

import { getOwnedExamReviewPath } from './examReview';

describe('owned exam review requests', () => {
  it('uses the authenticated owner/admin endpoint', () => {
    expect(getOwnedExamReviewPath('42', 'access-token')).toBe('/exams/42');
  });

  it('does not create a persisted-attempt request for anonymous or invalid input', () => {
    expect(getOwnedExamReviewPath('42', null)).toBeNull();
    expect(getOwnedExamReviewPath('../42', 'access-token')).toBeNull();
  });
});
