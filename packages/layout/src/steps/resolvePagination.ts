import { compose, omit } from '@react-pdf/fns';
import FontStore from '@react-pdf/font';
import * as P from '@react-pdf/primitives';

import createColumnViews from '../node/createColumnWrappers';
import createInstances from '../node/createInstances';
import canNodeWrap from '../node/getWrap';
import isFixed from '../node/isFixed';
import shouldNodeBreak from '../node/shouldBreak';
import splitNode from '../node/splitNode';
import getContentArea from '../page/getContentArea';
import getContentWidth from '../page/getContentWidth';
import getWrapArea from '../page/getWrapArea';
import splitText from '../text/splitText';
import splitTextAtWidth from '../text/splitTextAtWidth';
import {
  DynamicPageProps,
  SafeDocumentNode,
  SafeLinkNode,
  SafeNode,
  SafePageNode,
  SafeTextNode,
  SafeViewNode,
  YogaInstance,
} from '../types';
import { resolvePageDimensions } from './resolveDimensions';
import resolveInheritance from './resolveInheritance';
import { resolvePageStyles } from './resolveStyles';
import resolveTextLayout from './resolveTextLayout';
import splitNodesMultiColumn from './splitNodesMultiColumn';

const isText = (node: SafeNode): node is SafeTextNode => node.type === P.Text;

const isView = (node: SafeNode): node is SafeViewNode => node.type === P.View;

// Prevent splitting elements by low decimal numbers
const SAFETY_THRESHOLD = 0.001;

const assingChildren = <T>(children: SafeNode[], node: T): T =>
  Object.assign({}, node, { children });

const getTop = (node: SafeNode) => node.box?.top || 0;

const allFixed = (nodes: SafeNode[]) => nodes.every(isFixed);

const isDynamic = (
  node: SafeNode,
): node is SafeLinkNode | SafeTextNode | SafeViewNode =>
  node.props && 'render' in node.props;

const relayoutPage = compose(
  resolveTextLayout,
  resolvePageDimensions,
  resolveInheritance,
);

const relayoutDynamicPage = compose(
  resolveTextLayout,
  resolvePageDimensions,
  resolveInheritance,
  resolvePageStyles,
);

const relayoutDynamicPageForIndices = compose(
  resolveTextLayout,
  resolvePageDimensions,
  resolveInheritance,
);

const warnUnavailableSpace = (node: SafeNode) => {
  console.warn(
    `Node of type ${node.type} can't wrap between pages and it's bigger than available page height`,
  );
};

const splitNodes = (
  height: number,
  contentArea: number,
  nodes: SafeNode[],
  fontStore?: FontStore,
  containerWidth?: number,
) => {
  const currentChildren: SafeNode[] = [];
  const nextChildren: SafeNode[] = [];

  for (let i = 0; i < nodes.length; i += 1) {
    const child = nodes[i];
    const futureNodes = nodes.slice(i + 1);
    const futureFixedNodes = futureNodes.filter(isFixed);

    const nodeTop = getTop(child);
    const nodeHeight = child.box.height;
    const isOutside = height <= nodeTop;
    const shouldBreak = shouldNodeBreak(
      child,
      futureNodes,
      height,
      currentChildren,
    );
    const shouldSplit = height + SAFETY_THRESHOLD < nodeTop + nodeHeight;
    const canWrap = canNodeWrap(child);
    const fitsInsidePage = nodeHeight <= contentArea;

    if (isFixed(child)) {
      nextChildren.push(child);
      currentChildren.push(child);
      continue;
    }

    if (isOutside) {
      const box = Object.assign({}, child.box, { top: child.box.top - height });
      const next = Object.assign({}, child, { box });
      nextChildren.push(next);
      continue;
    }

    if (!fitsInsidePage && !canWrap) {
      currentChildren.push(child);
      nextChildren.push(...futureNodes);
      warnUnavailableSpace(child);
      break;
    }

    if (shouldBreak) {
      const box = Object.assign({}, child.box, { top: child.box.top - height });
      const props = Object.assign({}, child.props, {
        wrap: true,
        break: false,
      });
      const next = Object.assign({}, child, { box, props });

      currentChildren.push(...futureFixedNodes);
      nextChildren.push(next, ...futureNodes);
      break;
    }

    // Handle multi-column containers before generic split logic.
    // `child.box.height` here comes from pre-column layout and can overestimate
    // required height, which would trigger premature page splits.
    if (
      isView(child) &&
      ((child as SafeViewNode).props?.columns ?? 1) > 1 &&
      fontStore
    ) {
      const viewChild = child as SafeViewNode;
      const columns = viewChild.props?.columns ?? 1;
      const columnGap = viewChild.props?.columnGap ?? 18;
      const parentWidth = viewChild.box?.width ?? 0;
      const fallbackWidth = (containerWidth ?? 0) > 0 ? containerWidth! : 0;
      const effectiveWidth = parentWidth > 0 ? parentWidth : fallbackWidth;
      const colWidth =
        effectiveWidth > 0
          ? (effectiveWidth - columnGap * (columns - 1)) / columns
          : 0;

      // Guard against zero colWidth - layoutText at width 0 causes hang
      if (colWidth <= 0) {
        currentChildren.push(child);
        continue;
      }

      const splitFn = (ch: SafeNode, h: number, cArea: number) =>
        split(ch, h, cArea, fontStore, colWidth, colWidth) as [
          SafeNode,
          SafeNode,
        ];

      const { colChildren, nextChildren: overflowChildren } =
        splitNodesMultiColumn(
          height - nodeTop,
          contentArea,
          columns,
          colWidth,
          viewChild.children || [],
          splitFn,
          fontStore,
        );

      if (overflowChildren.length > 0) {
        const columnViews = createColumnViews(viewChild, colChildren, colWidth);
        const currentViewWithCols = Object.assign({}, viewChild, {
          style: {
            ...viewChild.style,
            flexDirection: 'row',
            columnGap,
            alignItems: 'flex-start',
          },
          children: columnViews,
        });
        const nextViewWithOverflow = Object.assign({}, viewChild, {
          children: overflowChildren,
          box: { ...viewChild.box, top: 0 },
        });
        // Keep fixed siblings (eg fixed footers/headers) on current page too.
        currentChildren.push(currentViewWithCols, ...futureFixedNodes);
        nextChildren.push(nextViewWithOverflow, ...futureNodes);
        break;
      }

      const childToPush = transformViewToColumns(
        viewChild,
        height - nodeTop,
        contentArea,
        fontStore,
        containerWidth,
      );
      currentChildren.push(childToPush);
      continue;
    }

    if (shouldSplit) {
      const [currentChild, nextChild] = split(
        child,
        height,
        contentArea,
        fontStore,
        undefined,
        containerWidth,
      );

      // All children are moved to the next page, it doesn't make sense to show the parent on the current page
      if (child.children.length > 0 && currentChild.children.length === 0) {
        // But if the current page is empty then we can just include the parent on the current page
        if (currentChildren.length === 0) {
          currentChildren.push(child, ...futureFixedNodes);
          nextChildren.push(...futureNodes);
        } else {
          const box = Object.assign({}, child.box, {
            top: child.box.top - height,
          });
          const next = Object.assign({}, child, { box });

          currentChildren.push(...futureFixedNodes);
          nextChildren.push(next, ...futureNodes);
        }
        break;
      }

      if (currentChild) currentChildren.push(currentChild);
      if (nextChild) nextChildren.push(nextChild);

      continue;
    }

    currentChildren.push(child);
  }

  return [currentChildren, nextChildren];
};

const splitChildren = (
  height: number,
  contentArea: number,
  node: SafeNode,
  fontStore?: FontStore,
) => {
  const children = node.children || [];
  const availableHeight = height - getTop(node);
  return splitNodes(availableHeight, contentArea, children, fontStore);
};

const transformViewToColumns = (
  node: SafeViewNode,
  availableHeight: number,
  contentArea: number,
  fontStore: FontStore,
  containerWidth?: number,
): SafeNode => {
  const columns = node.props?.columns ?? 1;
  const columnGap = node.props?.columnGap ?? 18;
  const parentWidth = node.box?.width ?? 0;
  const fallbackWidth = (containerWidth ?? 0) > 0 ? containerWidth! : 0;
  const effectiveWidth = parentWidth > 0 ? parentWidth : fallbackWidth;
  const colWidth =
    effectiveWidth > 0
      ? (effectiveWidth - columnGap * (columns - 1)) / columns
      : 0;

  if (colWidth <= 0) {
    return node;
  }

  const splitFn = (child: SafeNode, h: number, cArea: number) =>
    split(child, h, cArea, fontStore, colWidth, colWidth) as [
      SafeNode,
      SafeNode,
    ];

  const { colChildren } = splitNodesMultiColumn(
    availableHeight,
    contentArea,
    columns,
    colWidth,
    node.children || [],
    splitFn,
    fontStore,
  );

  const columnViews = createColumnViews(node, colChildren, colWidth);

  return Object.assign({}, node, {
    style: {
      ...node.style,
      flexDirection: 'row',
      columnGap,
      alignItems: 'flex-start',
    },
    children: columnViews,
  });
};

const splitView = (
  node: SafeNode,
  height: number,
  contentArea: number,
  fontStore?: FontStore,
  containerWidth?: number,
) => {
  const [currentNode, nextNode] = splitNode(node, height);

  const columns = (node as SafeViewNode).props?.columns ?? 1;
  const columnGap = (node as SafeViewNode).props?.columnGap ?? 18;

  if (isView(node) && columns > 1 && fontStore) {
    const availableHeight = height - getTop(node);
    const parentWidth = node.box?.width ?? 0;
    const fallbackWidth = (containerWidth ?? 0) > 0 ? containerWidth! : 0;
    const effectiveWidth = parentWidth > 0 ? parentWidth : fallbackWidth;
    const colWidth =
      effectiveWidth > 0
        ? (effectiveWidth - columnGap * (columns - 1)) / columns
        : 0;

    if (colWidth > 0) {
      const { colChildren, nextChildren } = splitNodesMultiColumn(
        availableHeight,
        contentArea,
        columns,
        colWidth,
        node.children || [],
        (child, h, cArea) =>
          split(child, h, cArea, fontStore, colWidth, colWidth) as [
            SafeNode,
            SafeNode,
          ],
        fontStore,
      );

      const columnViews = createColumnViews(
        node as SafeViewNode,
        colChildren,
        colWidth,
      );

      const currentViewWithRow = Object.assign({}, currentNode, {
        style: {
          ...currentNode.style,
          flexDirection: 'row',
          columnGap,
          alignItems: 'flex-start',
        },
      });

      return [
        assingChildren(columnViews, currentViewWithRow),
        assingChildren(nextChildren, nextNode),
      ];
    }
  }

  const [currentChilds, nextChildren] = splitChildren(
    height,
    contentArea,
    node,
    fontStore,
  );

  return [
    assingChildren(currentChilds, currentNode),
    assingChildren(nextChildren, nextNode),
  ];
};

const split = (
  node: SafeNode,
  height: number,
  contentArea: number,
  fontStore?: FontStore,
  colWidth?: number,
  containerWidth?: number,
) =>
  isText(node)
    ? colWidth != null && fontStore
      ? splitTextAtWidth(node, colWidth, height, fontStore)
      : splitText(node, height)
    : splitView(node, height, contentArea, fontStore, containerWidth);

const shouldResolveDynamicNodes = (node: SafeNode) => {
  const children = node.children || [];
  return isDynamic(node) || children.some(shouldResolveDynamicNodes);
};

const resolveDynamicNodes = (props: DynamicPageProps, node: SafeNode) => {
  const isNodeDynamic = isDynamic(node);

  // Call render prop on dynamic nodes and append result to children
  const resolveChildren = (children = []) => {
    if (isNodeDynamic) {
      const res = node.props.render(props);
      return (
        createInstances(res)
          .filter(Boolean)
          // @ts-expect-error rework dynamic nodes. conflicting types
          .map((n) => resolveDynamicNodes(props, n))
      );
    }

    return children.map((c) => resolveDynamicNodes(props, c));
  };

  // We reset dynamic text box so it can be computed again later on
  const resetHeight = isNodeDynamic && isText(node);
  const box = resetHeight ? { ...node.box, height: 0 } : node.box;

  const children = resolveChildren(node.children);

  // @ts-expect-error handle text here specifically
  const lines = isNodeDynamic ? null : node.lines;

  return Object.assign({}, node, { box, lines, children });
};

const resolveDynamicPage = (
  props: DynamicPageProps,
  page: SafePageNode,
  fontStore: FontStore,
  yoga: YogaInstance,
  options?: { resolveStyles?: boolean },
) => {
  if (shouldResolveDynamicNodes(page)) {
    const resolvedPage = resolveDynamicNodes(props, page);
    if (options?.resolveStyles === false) {
      return relayoutDynamicPageForIndices(resolvedPage, fontStore, yoga);
    }
    return relayoutDynamicPage(resolvedPage, fontStore, yoga);
  }

  return page;
};

const splitPage = (
  page: SafePageNode,
  pageNumber: number,
  fontStore: FontStore,
  yoga: YogaInstance,
): SafePageNode[] => {
  const wrapArea = getWrapArea(page);
  const contentArea = getContentArea(page);
  const containerWidth = getContentWidth(page);
  const dynamicPage = resolveDynamicPage({ pageNumber }, page, fontStore, yoga);
  const height = page.style.height;

  const [currentChilds, nextChilds] = splitNodes(
    wrapArea,
    contentArea,
    dynamicPage.children,
    fontStore,
    containerWidth,
  );

  const relayout = (node: SafePageNode): SafePageNode =>
    // @ts-expect-error rework pagination
    relayoutPage(node, fontStore, yoga) as SafePageNode;

  const currentBox = { ...page.box, height };
  const currentPage = relayout(
    Object.assign({}, page, { box: currentBox, children: currentChilds }),
  );

  if (nextChilds.length === 0 || allFixed(nextChilds))
    return [currentPage, null];

  const nextBox = omit('height', page.box);
  const nextProps = omit('bookmark', page.props);

  const nextPage = relayout(
    Object.assign({}, page, {
      props: nextProps,
      box: nextBox,
      children: nextChilds,
    }),
  );

  return [currentPage, nextPage];
};

const resolvePageIndices = (fontStore, yoga, page, pageNumber, pages) => {
  const totalPages = pages.length;

  const props = {
    totalPages,
    pageNumber: pageNumber + 1,
    subPageNumber: page.subPageNumber + 1,
    subPageTotalPages: page.subPageTotalPages,
  };

  return resolveDynamicPage(props, page, fontStore, yoga, {
    resolveStyles: false,
  });
};

const assocSubPageData = (subpages) => {
  return subpages.map((page, i) => ({
    ...page,
    subPageNumber: i,
    subPageTotalPages: subpages.length,
  }));
};

const dissocSubPageData = (page) => {
  return omit(['subPageNumber', 'subPageTotalPages'], page);
};

const MAX_PAGES = 1000;

const paginate = (
  page: SafePageNode,
  pageNumber: number,
  fontStore: FontStore,
  yoga: YogaInstance,
) => {
  if (!page) return [];

  if (page.props?.wrap === false) return [page];

  let splittedPage = splitPage(page, pageNumber, fontStore, yoga);

  const pages = [splittedPage[0]];
  let nextPage = splittedPage[1];

  while (nextPage !== null) {
    if (pages.length >= MAX_PAGES) {
      console.warn(
        `resolvePagination: max pages limit (${MAX_PAGES}) reached, stopping pagination`,
      );
      break;
    }

    splittedPage = splitPage(
      nextPage,
      pageNumber + pages.length,
      fontStore,
      yoga,
    );

    pages.push(splittedPage[0]);
    nextPage = splittedPage[1];
  }

  return pages;
};

/**
 * Performs pagination. This is the step responsible of breaking the whole document
 * into pages following pagiation rules, such as `fixed`, `break` and dynamic nodes.
 *
 * @param root - Document node
 * @param fontStore - Font store
 * @returns Layout node
 */
const resolvePagination = (
  root: SafeDocumentNode,
  fontStore: FontStore,
): SafeDocumentNode => {
  let pages = [];
  let pageNumber = 1;

  for (let i = 0; i < root.children.length; i += 1) {
    const page = root.children[i];
    let subpages = paginate(page, pageNumber, fontStore, root.yoga);

    subpages = assocSubPageData(subpages);
    pageNumber += subpages.length;
    pages = pages.concat(subpages);
  }

  pages = pages.map((...args) =>
    dissocSubPageData(resolvePageIndices(fontStore, root.yoga, ...args)),
  );

  return assingChildren(pages, root);
};

export default resolvePagination;
