// @vitest-environment happy-dom
/// <reference types="@testing-library/jest-dom" />

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import UserAvatar from '.';

afterEach(cleanup);

describe('user avatar', () => {
  it('renders identity as read-only', () => {
    render(<UserAvatar avatar="avatar-hash" />);

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByText('Alterar')).toBeNull();
  });
});
