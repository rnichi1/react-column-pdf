import FontStore from '@react-pdf/font';
import * as P from '@react-pdf/primitives';

import getBorderWidth from './getBorderWidth';
import getMargin from './getMargin';
import getPadding from './getPadding';
import layoutText from '../text/layoutText';
import { SafeNode, SafeTextNode } from '../types';

const isText = (node: SafeNode): node is SafeTextNode => node.type === P.Text;

export const getSpacingHeight = (node: SafeNode): number => {
  const { paddingTop, paddingBottom } = getPadding(node);
  const { marginTop, marginBottom } = getMargin(node);
  const { borderTopWidth, borderBottomWidth } = getBorderWidth(node);
  return (
    (paddingTop as number) +
    (paddingBottom as number) +
    (marginTop as number) +
    (marginBottom as number) +
    (borderTopWidth ?? 0) +
    (borderBottomWidth ?? 0)
  );
};

/**
 * Get the height a node would have when laid out at the given width.
 * Used for column distribution - nodes are initially laid out at full page width,
 * so their box.height underestimates the space they need when placed in a column.
 *
 * Includes padding, margin, border, and rowGap so distribution matches Yoga layout.
 *
 * @param node - Node to measure
 * @param colWidth - Width constraint (column width)
 * @param fontStore - Font store for text layout
 * @returns Height in points
 */
const getNodeHeightAtWidth = (
  node: SafeNode,
  colWidth: number,
  fontStore: FontStore,
): number => {
  // Text and View with children can be measured without box (before Yoga layout)
  if (isText(node)) {
    const preserveLines = (node.props as { __preserveLines?: boolean })
      ?.__preserveLines;
    if (preserveLines && node.lines?.length) {
      const contentHeight = (
        node.lines as { box?: { height?: number } }[]
      ).reduce((acc, line) => acc + (line?.box?.height ?? 0), 0);
      return contentHeight + getSpacingHeight(node);
    }
    try {
      const lines = layoutText(node, colWidth, Infinity, fontStore);
      const contentHeight = (lines || []).reduce(
        (acc, line) => acc + (line?.box?.height ?? 0),
        0,
      );
      return contentHeight + getSpacingHeight(node);
    } catch {
      return node.box?.height ?? 0;
    }
  }

  if (node.type === P.View && node.children?.length) {
    const { paddingTop, paddingBottom } = getPadding(node);
    const { borderTopWidth, borderBottomWidth } = getBorderWidth(node);
    const rowGap =
      ((node.style as Record<string, unknown>)?.rowGap as number) ?? 0;

    const childHeights = node.children.map((child) =>
      getNodeHeightAtWidth(child, colWidth, fontStore),
    );
    const contentHeight =
      childHeights.reduce((a, h) => a + h, 0) +
      (childHeights.length > 1 ? (childHeights.length - 1) * rowGap : 0);

    return (
      (paddingTop as number) +
      (paddingBottom as number) +
      (borderTopWidth ?? 0) +
      (borderBottomWidth ?? 0) +
      contentHeight
    );
  }

  // For Image, Svg, etc. we need box from Yoga
  if (!node.box?.height) return 0;
  return node.box.height;
};

export default getNodeHeightAtWidth;
