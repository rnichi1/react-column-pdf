import FontStore from '@react-pdf/font';
import * as P from '@react-pdf/primitives';

import canNodeWrap from '../node/getWrap';
import getNodeHeightAtWidth, {
  getSpacingHeight,
} from '../node/getNodeHeightAtWidth';
import isFixed from '../node/isFixed';
import shouldNodeBreak from '../node/shouldBreak';
import { SafeNode } from '../types';

const isText = (node: SafeNode) => node.type === P.Text;

const SAFETY_THRESHOLD = 0.001;

type SplitFn = (
  node: SafeNode,
  height: number,
  contentArea: number,
) => [SafeNode, SafeNode];

export type SplitNodesMultiColumnResult = {
  colChildren: SafeNode[][];
  nextChildren: SafeNode[];
};

const warnUnavailableSpace = (node: SafeNode) => {
  console.warn(
    `Node of type ${node.type} can't wrap between pages and it's bigger than available column height`,
  );
};

/**
 * Split nodes into columns and next page, using the same wrapping logic as pages.
 * Fills column 1 first, then column 2, etc., then overflows to next page.
 *
 * Uses getNodeHeightAtWidth so distribution is based on height at column width,
 * not the initial full-width layout height (which would underestimate).
 *
 * @param height - Available height from parent (wrap area - parent top)
 * @param contentArea - Max height per column
 * @param columns - Number of columns
 * @param colWidth - Width of each column (for accurate height measurement)
 * @param nodes - Children to distribute
 * @param splitFn - Function to split Text or View nodes
 * @param fontStore - Font store for text layout when measuring
 */
const splitNodesMultiColumn = (
  height: number,
  contentArea: number,
  columns: number,
  colWidth: number,
  nodes: SafeNode[],
  splitFn: SplitFn,
  fontStore: FontStore,
): SplitNodesMultiColumnResult => {
  const colChildren: SafeNode[][] = Array.from({ length: columns }, () => []);
  const nextChildren: SafeNode[] = [];
  const colHeights: number[] = Array(columns).fill(0);

  let colIndex = 0;
  const pending: SafeNode[] = [...nodes];

  while (pending.length > 0) {
    const child = pending.shift()!;
    const futureNodes = pending;

    if (isFixed(child)) {
      // Fixed nodes appear on current page (first column) and next page
      colChildren[0].push(child);
      nextChildren.push(child);
      continue;
    }

    // Overflowed all columns (e.g. nextPart from split in last column) → next page
    if (colIndex >= columns) {
      nextChildren.push(child);
      continue;
    }

    const nodeHeight = getNodeHeightAtWidth(child, colWidth, fontStore);
    const shouldBreak = shouldNodeBreak(
      child,
      futureNodes,
      height,
      colChildren[colIndex],
    );

    if (shouldBreak) {
      const box = Object.assign({}, child.box, {
        top: child.box.top - height,
      });
      const next = Object.assign({}, child, {
        box,
        props: {
          ...child.props,
          wrap: true,
          break: false,
        },
      });
      nextChildren.push(next);
      // Push remaining fixed nodes to current, then break
      for (const n of futureNodes) {
        if (isFixed(n)) {
          colChildren[0].push(n);
          nextChildren.push(n);
        }
      }
      // Preserve remaining nodes (mirror page-level splitNodes behavior)
      nextChildren.push(...pending);
      break;
    }

    // Find a column with space
    let placed = false;
    for (let c = colIndex; c < columns && !placed; c++) {
      const remaining = height - colHeights[c];

      if (nodeHeight <= remaining + SAFETY_THRESHOLD) {
        colChildren[c].push(child);
        colHeights[c] += nodeHeight;
        placed = true;
        colIndex = c; // Next node tries this column first
        break;
      }

      // Doesn't fit - try to split
      if (canNodeWrap(child)) {
        // For Text: content space = remaining - node's margin/padding/border
        const splitSpace = isText(child)
          ? Math.max(0, remaining - getSpacingHeight(child))
          : remaining;
        const [currentPart, nextPart] = splitFn(child, splitSpace, height);

        // Current part might be empty (orphans/widows or no lines fit in remaining)
        // If empty, don't split - try next column with whole node to avoid infinite loop
        if (currentPart && currentPart.box.height > 0) {
          colChildren[c].push(currentPart);
          colHeights[c] += getNodeHeightAtWidth(
            currentPart,
            colWidth,
            fontStore,
          );
          placed = true;

          // Try to place next part in next column
          if (nextPart && nextPart.box.height > 0) {
            pending.unshift(nextPart);
            colIndex = c + 1;
          }
        }
        // else: currentPart empty (slicedLineIndex was 0) - fall through to try next column
        if (placed) break;
      }

      // Can't wrap - try next column, or push to next page if all columns tried
      if (c === columns - 1) {
        warnUnavailableSpace(child);
        nextChildren.push(child);
        placed = true;
      }
    }

    if (!placed) {
      nextChildren.push(child);
    }
  }

  return { colChildren, nextChildren };
};

export default splitNodesMultiColumn;
