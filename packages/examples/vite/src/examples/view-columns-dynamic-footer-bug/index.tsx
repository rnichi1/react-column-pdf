import React from 'react';
import { Document, Page, StyleSheet, Text, View } from 'react-column-pdf';

const LOREM =
  'Die Verkaufsdokumentation gemachten Angaben dienen der allgemeinen Information und erfolgen ohne Gewahr. Sie bilden keinen Bestandteil einer vertraglichen Vereinbarung.';

const styles = StyleSheet.create({
  page: {
    padding: 40,
  },
  title: {
    fontSize: 18,
    marginBottom: 18,
    textAlign: 'left',
  },
  content: {
    flex: 1,
    marginBottom: 42,
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 6,
    color: '#8f3a2f',
  },
  paragraph: {
    fontSize: 10.5,
    lineHeight: 1.7,
    marginBottom: 10,
    textAlign: 'left',
  },
  footerOuter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 36,
    borderTop: '1px solid #d0d0d0',
    paddingHorizontal: 40,
    paddingVertical: 6,
  },
});

const DynamicFooter = () => (
  <View
    fixed
    style={styles.footerOuter}
    render={({ pageNumber, totalPages }) => (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 9, color: '#666' }}>
          Footer with View.render
        </Text>
        <Text style={{ fontSize: 9, color: '#666' }}>
          {pageNumber} / {totalPages}
        </Text>
      </View>
    )}
  />
);

const makeSection = (title: string, count: number) =>
  Array.from({ length: count }).map((_, i) => (
    <Text key={`${title}-${i}`} style={styles.paragraph}>
      {LOREM}
    </Text>
  ));

const ViewColumnsDynamicFooterBug = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Repro: Two Columns + Dynamic Footer</Text>

      <View columns={2} columnGap={24} style={styles.content}>
        {makeSection('Verkaufspreis', 3)}
        {makeSection('Reservationsvertrag', 3)}
        {makeSection('Gebuhren', 3)}
        {makeSection('Kaufkonditionen', 3)}
        {makeSection('Finanzierung', 3)}
        {makeSection('Ubergabe', 2)}
        {makeSection('Rechtlicher Hinweis', 2)}
      </View>
      <DynamicFooter />
    </Page>
  </Document>
);

export default {
  id: 'view-columns-dynamic-footer-bug',
  name: 'Repro: Columns + Dynamic Footer',
  description:
    'Reproduces spacing/pagination issue with fixed footer render prop',
  Document: ViewColumnsDynamicFooterBug,
};
