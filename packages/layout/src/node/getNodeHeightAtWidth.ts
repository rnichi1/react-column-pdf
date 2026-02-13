import FontStore from '@react-pdf/font';
import * as P from '@react-pdf/primitives';

import layoutText from '../text/layoutText';
import { SafeNode, SafeTextNode } from '../types';

const isText = (node: SafeNode): node is SafeTextNode => node.type === P.Text;

/**
 * Get the height a node would have when laid out at the given width.
 * Used for column distribution - nodes are initially laid out at full page width,
 * so their box.height underestimates the space they need when placed in a column.
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
  if (!node.box?.height) return 0;

  if (isText(node)) {
    const lines = layoutText(node, colWidth, Infinity, fontStore);
    return lines.reduce((acc, line) => acc + line.box.height, 0);
  }

  if (node.type === P.View && node.children?.length) {
    return node.children.reduce(
      (acc, child) => acc + getNodeHeightAtWidth(child, colWidth, fontStore),
      0,
    );
  }

  return node.box.height;
};

export default getNodeHeightAtWidth;
