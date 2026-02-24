import React from 'react';
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from 'react-column-pdf';

const FOOTER_HEIGHT = 32;
const CONTENT_PADDING = 40;
const IMAGE_HEIGHT = 170;
const IMAGE_TEXT_GAP = 18;
const COLUMN_GAP = 24;

const IMAGE_SRC =
  'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&w=1400&q=70';

const PARAGRAPH =
  'Die Verkaufsdokumentation gemachten Angaben dienen der allgemeinen Information und erfolgen ohne Gewahr. Sie bilden keinen Bestandteil einer vertraglichen Vereinbarung.';

const styles = StyleSheet.create({
  page: {
    paddingTop: CONTENT_PADDING + IMAGE_HEIGHT + IMAGE_TEXT_GAP,
    paddingRight: CONTENT_PADDING,
    paddingBottom: CONTENT_PADDING + FOOTER_HEIGHT,
    paddingLeft: CONTENT_PADDING,
  },
  fixedImageWrap: {
    position: 'absolute',
    top: CONTENT_PADDING,
    left: CONTENT_PADDING,
    right: CONTENT_PADDING,
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
  },
  fixedImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  paragraph: {
    fontSize: 10.5,
    lineHeight: 1.6,
    marginBottom: 7,
    textAlign: 'left',
  },
  footer: {
    position: 'absolute',
    left: CONTENT_PADDING,
    right: CONTENT_PADDING,
    bottom: 10,
    height: FOOTER_HEIGHT - 12,
    borderTop: '1px solid #d0d0d0',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const blocks = Array.from({ length: 30 }).map((_, i) => (
  <Text key={`p-${i}`} style={styles.paragraph}>
    {PARAGRAPH}
  </Text>
));

const ViewColumnsFixedImageHeader = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View fixed style={styles.fixedImageWrap}>
        <Image src={IMAGE_SRC} style={styles.fixedImage} />
      </View>

      <Text style={styles.title}>Repro: Fixed Image + 2 Columns</Text>

      <View columns={2} columnGap={COLUMN_GAP} style={styles.content}>
        {blocks}
      </View>

      <View
        fixed
        style={styles.footer}
        render={({ pageNumber, totalPages }) => (
          <>
            <Text style={{ fontSize: 9 }}>Fixed footer</Text>
            <Text style={{ fontSize: 9 }}>
              {pageNumber} / {totalPages}
            </Text>
          </>
        )}
      />
    </Page>
  </Document>
);

export default {
  id: 'view-columns-fixed-image-header',
  name: 'Repro: Fixed Image + Columns',
  description:
    'Fixed hero image and footer with 2-column content to verify pagination',
  Document: ViewColumnsFixedImageHeader,
};
