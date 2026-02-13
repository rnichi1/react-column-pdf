import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

const styles = StyleSheet.create({
  body: {
    padding: 36,
  },
  headline: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  deck: {
    fontSize: 12,
    marginBottom: 16,
    color: '#333',
  },
  byline: {
    fontSize: 9,
    marginBottom: 20,
    color: '#666',
  },
  dropCap: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.2,
  },
  block: {
    fontSize: 11,
    marginBottom: 12,
    textAlign: 'justify',
    lineHeight: 1.5,
  },
  blockSmall: {
    fontSize: 9,
    marginBottom: 8,
    textAlign: 'justify',
    lineHeight: 2,
  },
  subhead: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginTop: 12,
    marginBottom: 6,
  },
});

const ViewColumnsMagazine = () => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.headline}>The Future of Digital Publishing</Text>
      <Text style={styles.deck}>
        How multi-column layouts are changing the way we consume content
      </Text>
      <Text style={styles.byline}>By the Layout Team — February 2026</Text>
      <View columns={2} columnGap={24}>
        <Text style={styles.block}>
          <Text style={styles.dropCap}>T</Text>
          his article explores the future of digital publishing. {LOREM} {LOREM}{' '}
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.subhead}>Key Takeaways</Text>
        <Text style={styles.blockSmall}>
          {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM}
        </Text>
        <Text style={styles.blockSmall}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.blockSmall}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
      </View>
    </Page>
  </Document>
);

export default {
  id: 'view-columns-magazine',
  name: 'Columns (Magazine Style)',
  description:
    'Mixed typography: headline, deck, byline, and varied body sizes',
  Document: ViewColumnsMagazine,
};
