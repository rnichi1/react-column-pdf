import { Document, Page, StyleSheet, Text, View } from 'react-column-pdf';
import React from 'react';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

const styles = StyleSheet.create({
  body: {
    padding: 36,
  },
  title: {
    fontSize: 18,
    marginBottom: 14,
    textAlign: 'center',
  },
  note: {
    fontSize: 9,
    marginBottom: 14,
    color: '#666',
  },
  block: {
    fontSize: 10,
    marginBottom: 10,
    textAlign: 'justify',
  },
  subhead: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
});

const ViewColumnsBreak = () => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.title}>View Columns With Explicit Break</Text>
      <Text style={styles.note}>
        The "Key Takeaways" section uses break to start at the next column.
      </Text>

      <View columns={2} columnGap={24}>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM}
        </Text>

        <Text style={styles.subhead} break>
          Key Takeaways (forced next column)
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM}
        </Text>
      </View>
    </Page>
  </Document>
);

export default {
  id: 'view-columns-break',
  name: 'View Columns + break',
  description: 'Use break on a child to force the next column in View columns',
  Document: ViewColumnsBreak,
};
