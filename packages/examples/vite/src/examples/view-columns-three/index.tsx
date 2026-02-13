import { Document, Page, StyleSheet, Text, View } from 'react-column-pdf';
import React from 'react';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const styles = StyleSheet.create({
  body: {
    padding: 30,
  },
  title: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  block: {
    fontSize: 9,
    marginBottom: 10,
    textAlign: 'justify',
    lineHeight: '3pt',
  },
});

const ViewColumnsThree = () => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.title}>Three-Column Layout (Newspaper Style)</Text>
      <View columns={3} columnGap={12}>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
      </View>
    </Page>
  </Document>
);

export default {
  id: 'view-columns-three',
  name: 'View Columns (3)',
  description:
    'View with columns={3} and columnGap={12} - narrow columns, newspaper style',
  Document: ViewColumnsThree,
};
