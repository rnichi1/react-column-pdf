import { isNil } from '@react-pdf/fns';

import { Engines } from '../engines';
import blockHeight from '../paragraph/height';
import sliceBlockAtHeight from '../paragraph/sliceAtHeight';
import truncateBlock from '../paragraph/truncate';
import copyRect from '../rect/copy';
import cropRect from '../rect/crop';
import { AttributedString, Container, Paragraph } from '../types';
import layoutParagraph from './layoutParagraph';

/**
 * Layout paragraphs inside container until it does not
 * fit anymore, performing line wrapping in the process.
 *
 * @param  engines - Engines
 * @param  options - Layout options
 * @param container - Container
 */
const typesetter = (engines: Engines, options, container: Container) => {
  /**
   * @param attributedStrings - Attributed strings (paragraphs)
   * @returns Paragraph blocks
   */
  return (attributedStrings: AttributedString[]) => {
    const result: Paragraph[] = [];
    const paragraphs = [...attributedStrings];
    const layout = layoutParagraph(engines, options);
    const maxLines = isNil(container.maxLines) ? Infinity : container.maxLines;
    const truncateEllipsis = container.truncateMode === 'ellipsis';

    let linesCount = maxLines;
    let paragraphRect = copyRect(container);
    let nextParagraph = paragraphs.shift();

    while (linesCount > 0 && nextParagraph) {
      const paragraph = layout(paragraphRect, nextParagraph);
      const slicedBlock = paragraph.slice(0, linesCount);
      const linesHeight = blockHeight(slicedBlock);
      const availableHeight =
        (paragraphRect as Container).effectiveHeight ?? paragraphRect.height;

      const shouldTruncate =
        truncateEllipsis && paragraph.length !== slicedBlock.length;

      linesCount -= slicedBlock.length;

      if (availableHeight >= linesHeight) {
        result.push(shouldTruncate ? truncateBlock(slicedBlock) : slicedBlock);
        paragraphRect = cropRect(linesHeight, paragraphRect);
        nextParagraph = paragraphs.shift();
      } else {
        result.push(
          truncateBlock(sliceBlockAtHeight(availableHeight, slicedBlock)),
        );
        break;
      }
    }

    return result;
  };
};

export default typesetter;
