import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const styles = StyleSheet.create({
  body: {
    padding: 40,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  block: {
    fontSize: 10,
    marginBottom: 12,
    textAlign: 'justify',
  },
});

const ViewColumns = () => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.title}>Two-Column Layout</Text>
      <View columns={2} columnGap={18}>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
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
  id: 'view-columns',
  name: 'View Columns (2)',
  description:
    'View with columns={2} - content flows left to right, then to next page',
  Document: ViewColumns,
};
