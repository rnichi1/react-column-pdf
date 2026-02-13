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
  red: {
    color: 'red',
  },
  blue: {
    color: 'blue',
  },
  green: {
    color: 'green',
  },
  yellow: {
    color: 'yellow',
  },
  purple: {
    color: 'purple',
  },
});

const ViewColumns = () => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.title}>View Columns</Text>
      <Text style={styles.title}>View Columns</Text>
      <Text style={styles.title}>View Columns</Text>
      <Text style={styles.title}>View Columns</Text>
      <View columns={2} columnGap={18}>
        <Text style={[styles.block, styles.red]} debug>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={[styles.block, styles.blue]} debug>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={[styles.block, styles.green]} debug>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={[styles.block, styles.yellow]} debug>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={[styles.block, styles.purple]} debug>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={[styles.block, styles.red]} debug>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={[styles.block, styles.blue]} debug>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={[styles.block, styles.green]} debug>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={[styles.block, styles.yellow]} debug>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={[styles.block, styles.purple]} debug>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={[styles.block, styles.red]} debug>
          {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM}
        </Text>
        <Text style={[styles.block]} debug>
          {LOREM} {LOREM}
        </Text>
        <Text style={styles.block} debug>
          {LOREM} {LOREM}
        </Text>
        <Text style={{ ...styles.block, ...styles.red }} debug>
          {LOREM} {LOREM}
          {LOREM} {LOREM}
          {LOREM} {LOREM}
          {LOREM} {LOREM}
          {LOREM} {LOREM}
        </Text>
      </View>
    </Page>
  </Document>
);

export default {
  id: 'view-columns',
  name: 'View Columns',
  description:
    'View with columns={2} prop - content flows to next column before wrapping to next page',
  Document: ViewColumns,
};
