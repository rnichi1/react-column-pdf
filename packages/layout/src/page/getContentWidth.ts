import getPadding from '../node/getPadding';
import { SafePageNode } from '../types';
import getSize from './getSize';

/** A4 width in points - fallback when page dimensions unknown */
const DEFAULT_PAGE_WIDTH = 595.28;

/**
 * Get the content width of a page (width minus horizontal padding).
 * Uses getSize when box/style width is not yet resolved (e.g. before Yoga layout).
 */
const getContentWidth = (page: SafePageNode) => {
  const size = getSize(page as any);
  const width =
    (page.style?.width as number) ?? size.width ?? DEFAULT_PAGE_WIDTH;
  const { paddingLeft, paddingRight } = getPadding(page as any);
  return Math.max(
    0,
    width - (paddingLeft as number) - (paddingRight as number),
  );
};

export default getContentWidth;
