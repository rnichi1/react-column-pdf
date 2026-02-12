import { Document, Page, StyleSheet, Text } from '@react-pdf/renderer';
import React from 'react';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const styles = StyleSheet.create({
  body: {
    padding: 40,
    maxHeight: 300,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  singleColumn: {
    fontSize: 10,
    marginBottom: 30,
    textAlign: 'justify',
  },
  twoColumn: {
    fontSize: 10,
    textAlign: 'justify',
  },
});

const TwoColumns = () => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.twoColumn} columns={2} columnGap={18}>
        {LOREM} {LOREM} {LOREM} {LOREM} {LOREM} {LOREM} {LOREM} {LOREM} {LOREM}{' '}
        {LOREM} {LOREM} {LOREM} {LOREM} {LOREM} {LOREM} {LOREM} {LOREM} {LOREM}{' '}
        {LOREM} {LOREM} {LOREM}
      </Text>
    </Page>
  </Document>
);

export default {
  id: 'two-columns',
  name: 'Two Columns',
  description: 'Text with columns={2} prop for two-column layout',
  Document: TwoColumns,
};
