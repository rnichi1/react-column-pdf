import React from 'react';
import {
  Document,
  Page,
  View,
  Image,
  Text,
  StyleSheet,
} from '@react-pdf/renderer';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

const IMAGE_SRC =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png';

const styles = StyleSheet.create({
  body: {
    padding: 40,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  heroImage: {
    width: '100%',
    height: 120,
    objectFit: 'cover',
    marginBottom: 20,
    borderRadius: 4,
  },
  block: {
    fontSize: 10,
    marginBottom: 12,
    textAlign: 'justify',
  },
});

const ViewColumnsImageTop = () => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.title}>Article with Hero Image</Text>
      <Image src={IMAGE_SRC} style={styles.heroImage} />
      <View columns={2} columnGap={18}>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM}
        </Text>
      </View>
    </Page>
  </Document>
);

export default {
  id: 'view-columns-image-top',
  name: 'Columns + Image (Top)',
  description: 'Full-width image above two-column text layout',
  Document: ViewColumnsImageTop,
};
