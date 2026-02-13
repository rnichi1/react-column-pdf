import FontStore from '@react-pdf/font';

import layoutText from './layoutText';
import { SafeTextNode } from '../types';

type LineWithBox = { box: { height: number } };

/**
 * Get line break index for given lines and height, with orphan/widow handling.
 * Mirrors getLineBreak from splitText but operates on pre-laid-out lines.
 */
const getLineBreakForLines = (
  lines: LineWithBox[],
  height: number,
  orphans: number,
  widows: number,
): number => {
  if (!lines?.length) return 0;

  let y = 0;
  let slicedLine = lines.length;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const lineHeight = line?.box?.height ?? 0;
    if (lineHeight <= 0) continue;
    if (y + lineHeight > height) {
      slicedLine = i;
      break;
    }
    y += lineHeight;
  }

  const linesQuantity = lines.length;

  if (slicedLine === 0) return 0;
  if (linesQuantity < orphans) return linesQuantity;
  // Relax orphans: when strict rules would return 0 but at least one line fits,
  // allow minimal split to avoid moving whole block to next column
  if (slicedLine < orphans || linesQuantity < orphans + widows) {
    if (slicedLine >= 1) return 1;
    return 0;
  }
  if (linesQuantity === orphans + widows) return orphans;
  if (linesQuantity - slicedLine < widows) return linesQuantity - widows;

  return slicedLine;
};

/**
 * Sum height of lines from start to index (exclusive).
 */
const heightAtLineIndexForLines = (
  lines: LineWithBox[],
  index: number,
): number => {
  let counter = 0;
  for (let i = 0; i < index && i < lines.length; i += 1) {
    counter += lines[i]?.box?.height ?? 0;
  }
  return counter;
};

/**
 * Sum total height of all lines.
 */
const totalLinesHeight = (lines: LineWithBox[]): number =>
  (lines || []).reduce((acc, line) => acc + (line?.box?.height ?? 0), 0);

/**
 * Split text at the given width, using layout at that width for accurate line breaking.
 * Used for column distribution where text is laid out at column width, not full page width.
 *
 * @param node - Text node to split
 * @param colWidth - Width constraint (column width)
 * @param height - Available vertical space (remaining in column)
 * @param fontStore - Font store for text layout
 * @returns [currentPart, nextPart] - same structure as splitText
 */
const splitTextAtWidth = (
  node: SafeTextNode,
  colWidth: number,
  height: number,
  fontStore: FontStore,
): [SafeTextNode, SafeTextNode] => {
  let rawLines: unknown;
  try {
    rawLines = layoutText(node, colWidth, Infinity, fontStore);
  } catch {
    const empty: SafeTextNode = Object.assign({}, node, {
      box: { ...node.box, height: 0 },
      lines: [],
    });
    return [empty, empty];
  }
  const lines = Array.isArray(rawLines) ? (rawLines as LineWithBox[]) : [];

  if (!lines.length) {
    const empty: SafeTextNode = Object.assign({}, node, {
      box: { ...node.box, height: 0 },
      lines: [],
    });
    return [empty, empty];
  }

  const widows = node.props?.widows ?? 2;
  const orphans = node.props?.orphans ?? 2;

  const slicedLineIndex = getLineBreakForLines(lines, height, orphans, widows);
  const currentHeight = heightAtLineIndexForLines(lines, slicedLineIndex);
  const totalHeight = totalLinesHeight(lines);
  const nextHeight = totalHeight - currentHeight;

  const current: SafeTextNode = Object.assign({}, node, {
    box: {
      ...node.box,
      height: currentHeight,
      borderBottomWidth: 0,
    },
    style: {
      ...node.style,
      marginBottom: 0,
      paddingBottom: 0,
      borderBottomWidth: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    lines: lines.slice(0, slicedLineIndex),
    props: {
      ...node.props,
      __preserveLines: true,
    },
  });

  const next: SafeTextNode = Object.assign({}, node, {
    box: {
      ...node.box,
      top: 0,
      height: nextHeight,
      borderTopWidth: 0,
    },
    style: {
      ...node.style,
      marginTop: 0,
      paddingTop: 0,
      borderTopWidth: 0,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    lines: lines.slice(slicedLineIndex),
    props: {
      ...node.props,
      __preserveLines: true,
    },
  });

  return [current, next];
};

export default splitTextAtWidth;
