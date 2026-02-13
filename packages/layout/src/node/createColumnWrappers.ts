import * as P from '@react-pdf/primitives';

import { SafeNode, SafeTextNode, SafeViewNode } from '../types';

const isText = (node: SafeNode): node is SafeTextNode => node.type === P.Text;

/**
 * Clear lines from Text nodes so they get relayout with the column width.
 * Text nodes retain their previous layout (full-width) unless we clear lines,
 * which forces the measure function to run layoutText again with the correct width.
 */
const clearTextLinesForRelayout = (nodes: SafeNode[]): SafeNode[] =>
  nodes.map((child) => {
    if (isText(child)) {
      return Object.assign({}, child, { lines: undefined });
    }
    if (child.children) {
      return Object.assign({}, child, {
        children: clearTextLinesForRelayout(child.children),
      });
    }
    return child;
  });

/**
 * Create column wrapper View nodes for multi-column layout.
 * Each column View has a fixed width so children (especially Text) get correct measurements.
 *
 * @param parent - The parent View with columns
 * @param colChildren - Array of child arrays, one per column
 * @param colWidth - Width of each column
 * @returns Array of View nodes, one per column
 */
const FLEX_PROPS = ['flex', 'flexGrow', 'flexShrink', 'flexBasis'];

const omitFlexFromStyle = (style: Record<string, unknown> = {}) => {
  const result = { ...style };
  FLEX_PROPS.forEach((prop) => delete result[prop]);
  return result;
};

const createColumnViews = (
  parent: SafeViewNode,
  colChildren: SafeNode[][],
  colWidth: number,
): SafeNode[] => {
  return colChildren.map((children) => {
    const childrenWithClearedText = clearTextLinesForRelayout(children);
    const columnView: SafeNode = {
      type: P.View,
      props: {
        ...parent.props,
        wrap: true,
        columns: undefined,
        columnGap: undefined,
      },
      style: {
        ...omitFlexFromStyle(parent.style as Record<string, unknown>),
        width: colWidth,
        flexDirection: 'column',
        flexShrink: 0,
      },
      box: undefined as any,
      children: childrenWithClearedText as SafeViewNode['children'],
    };

    return columnView;
  });
};

export default createColumnViews;
