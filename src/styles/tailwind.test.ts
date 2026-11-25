import { readFile } from 'node:fs/promises';
import path from 'node:path';

import tailwindcss from '@tailwindcss/postcss';
import postcss from 'postcss';
import { expect, test } from 'vitest';

test('Tailwind emits branded, dark, plugin, and accessible control styles', async () => {
  const from = path.resolve('src/styles/globals.css');
  const source = await readFile(from, 'utf8');
  const { css } = await postcss([tailwindcss()]).process(source, { from });

  expect(css).toContain('.bg-primary');
  expect(css).toContain('.bg-primary\\/10');
  expect(css).toContain('.dark\\:bg-secondary-dark');
  expect(css).toContain('.bg-hero-gradient');
  expect(css).toContain('.animate-in');
  expect(css).toContain('padding-inline: 1rem');
  expect(
    /\.focus-visible\\:outline-hidden:focus-visible\s*\{[^}]*@media \(forced-colors: active\)\s*\{\s*outline: 2px solid transparent;/.test(
      css
    )
  ).toBe(true);
  expect(/button:not\(:disabled\)\s*\{\s*cursor: pointer;/.test(css)).toBe(true);
});
