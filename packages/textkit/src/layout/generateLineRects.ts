import intersects from '../rect/intersects';
import partition from '../rect/partition';
import { Container, Rect } from '../types';

const getLineFragment = (lineRect: Rect, excludeRect: Rect): Rect[] => {
  if (!intersects(excludeRect, lineRect)) return [lineRect];

  const eStart = excludeRect.x;
  const eEnd = excludeRect.x + excludeRect.width;
  const lStart = lineRect.x;
  const lEnd = lineRect.x + lineRect.width;

  const a = Object.assign({}, lineRect, { width: eStart - lStart });
  const b = Object.assign({}, lineRect, { x: eEnd, width: lEnd - eEnd });

  return [a, b].filter((r) => r.width > 0);
};

const getLineFragments = (rect: Rect, excludeRects: Rect[]) => {
  let fragments = [rect];

  for (let i = 0; i < excludeRects.length; i += 1) {
    const excludeRect = excludeRects[i];

    fragments = fragments.reduce((acc, fragment) => {
      const pieces = getLineFragment(fragment, excludeRect);
      return acc.concat(pieces);
    }, []);
  }

  return fragments;
};

const generateLineRects = (container: Container, height: number) => {
  const { excludeRects, columns, columnGap, ...rect } = container;

  if (columns != null && columns > 1 && columnGap != null) {
    const gap = columnGap * (columns - 1);
    const colWidth = (rect.width - gap) / columns;
    const lineRects: Rect[] = [];
    for (let i = 0; i < columns; i += 1) {
      lineRects.push({
        x: rect.x + i * (colWidth + columnGap),
        y: rect.y,
        width: colWidth,
        height: rect.height,
      });
    }
    return lineRects;
  }

  if (!excludeRects) return [rect];

  const lineRects: Rect[] = [];
  const maxY = Math.max(...excludeRects.map((r) => r.y + r.height));

  let currentRect = rect;

  while (currentRect.y < maxY) {
    const [lineRect, rest] = partition(currentRect, height);
    const lineRectFragments = getLineFragments(lineRect, excludeRects);

    currentRect = rest;
    lineRects.push(...lineRectFragments);
  }

  return [...lineRects, currentRect];
};

export default generateLineRects;
