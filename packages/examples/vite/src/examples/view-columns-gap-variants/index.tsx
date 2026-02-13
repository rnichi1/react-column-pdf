import { Document, Page, StyleSheet, Text, View } from 'react-column-pdf';
import React from 'react';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const styles = StyleSheet.create({
  body: {
    padding: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    marginTop: 20,
  },
  block: {
    fontSize: 9,
    marginBottom: 8,
    textAlign: 'justify',
  },
});

const ViewColumnsGapVariants = () => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={[styles.sectionTitle, { marginTop: 0 }]}>
        Column gap variants (2 columns)
      </Text>

      <Text style={styles.sectionTitle}>columnGap = 6 (narrow)</Text>
      <View columns={2} columnGap={6}>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>columnGap = 18 (default)</Text>
      <View columns={2} columnGap={18}>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>columnGap = 36 (wide)</Text>
      <View columns={2} columnGap={36}>
        <Text style={styles.block}>
          {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM}
        </Text>
      </View>
    </Page>
  </Document>
);

export default {
  id: 'view-columns-gap-variants',
  name: 'Columns (Gap Variants)',
  description: 'Same layout with different columnGap values: 6, 18, 36',
  Document: ViewColumnsGapVariants,
};
