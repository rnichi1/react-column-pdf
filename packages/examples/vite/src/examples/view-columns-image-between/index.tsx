import React from 'react';
import {
  Document,
  Page,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-column-pdf';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.';

const IMAGE_SRC =
  'https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg';

const styles = StyleSheet.create({
  body: {
    padding: 40,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  inlineImage: {
    width: 150,
    height: 100,
    objectFit: 'cover',
    marginVertical: 16,
    marginHorizontal: 'auto',
  },
  block: {
    fontSize: 10,
    marginBottom: 10,
    textAlign: 'justify',
  },
});

const ViewColumnsImageBetween = () => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.title}>Magazine Layout</Text>
      <Text style={styles.subtitle}>Image between header and columns</Text>
      <View style={{ alignItems: 'center' }}>
        <Image src={IMAGE_SRC} style={styles.inlineImage} />
      </View>
      <View columns={2} columnGap={18}>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
        </Text>
        <Text style={styles.block}>
          {LOREM} {LOREM} {LOREM} {LOREM}
          {LOREM} {LOREM} {LOREM}
        </Text>
      </View>
    </Page>
  </Document>
);

export default {
  id: 'view-columns-image-between',
  name: 'Columns + Image (Between)',
  description: 'Centered image between title and two-column content',
  Document: ViewColumnsImageBetween,
};
