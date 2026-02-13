import { describe, expect, test } from 'vitest';

import generateLineRects from '../../src/layout/generateLineRects';

describe('generateLineRects', () => {
  test('should return two column rects when columns=2', () => {
    const container = {
      x: 0,
      y: 0,
      width: 400,
      height: 100,
      columns: 2,
      columnGap: 18,
    };
    const rects = generateLineRects(container, 20);

    expect(rects).toHaveLength(2);

    const colWidth = (400 - 18) / 2;
    expect(rects[0]).toEqual({
      x: 0,
      y: 0,
      width: colWidth,
      height: 100,
    });
    expect(rects[1]).toEqual({
      x: colWidth + 18,
      y: 0,
      width: colWidth,
      height: 100,
    });
  });

  test('should return single rect when columns not specified', () => {
    const container = { x: 0, y: 0, width: 400, height: 100 };
    const rects = generateLineRects(container, 20);

    expect(rects).toHaveLength(1);
    expect(rects[0]).toEqual({ x: 0, y: 0, width: 400, height: 100 });
  });
});
