import { readFileSync } from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

const css = readFileSync(path.resolve(__dirname, '../../../styles/scoreIndicator.css'), 'utf8');

// Declarations of every rule whose selector is exactly `.indicator::before` (desktop and mobile).
const mutedArcDeclarations = () =>
  Array.from(css.matchAll(/\.indicator::before\s*\{([^}]*)\}/g), (m) => m[1]);

// Declarations of every rule whose selector is exactly `.indicator` (desktop and mobile).
const indicatorDeclarations = () =>
  Array.from(css.matchAll(/(?:^|\s)\.indicator\s*\{([^}]*)\}/g), (m) => m[1]);

describe('ScoreIndicator gauge layout', () => {
  it('does not translate the muted background arc horizontally', () => {
    // The arc spans the full indicator width and is positioned starts at the indicator’s left edge.
    // A horizontal translate pushes its centre off the indicator centre, so one half of the
    // wheel is clipped by overflow: hidden and the arcs no longer line up.
    const horizontal = mutedArcDeclarations()
      .flatMap((body) => Array.from(body.matchAll(/transform:\s*([^;]+);/g), (m) => m[1].trim()))
      .filter((value) => /translateX|translate\(|translate3d/.test(value));

    expect(horizontal).toEqual([]);
  });

  it('keeps the gauge contained in narrow cards at desktop and mobile widths', () => {
    // Fixed widths overflow narrower cards; the gauge must be fluid and capped at each breakpoint.
    const bodies = indicatorDeclarations();
    const desktop = bodies.find((body) => /max-width:\s*320px/.test(body));
    const mobile = bodies.find((body) => /max-width:\s*240px/.test(body));

    expect(desktop).toBeDefined();
    expect(mobile).toBeDefined();
    expect(desktop).toMatch(/width:\s*100%/);
  });
});

it('scales the gauge height and both arc radii with its width', () => {
  expect(indicatorDeclarations().join('\n')).toMatch(/aspect-ratio:\s*2\b/);
  expect(mutedArcDeclarations().join('\n')).toMatch(
    /border-radius:\s*50% 50% 0 0\s*\/\s*100% 100% 0 0/
  );
  expect(css).toMatch(/border-radius:\s*0 0 50% 50%\s*\/\s*0 0 100% 100%/);
  expect(css).not.toMatch(/border-(?:top|bottom)-(?:left|right)-radius:\s*\d+px/);
});
