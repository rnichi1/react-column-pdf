<p align="center">
  <img src="https://user-images.githubusercontent.com/5600341/27505816-c8bc37aa-587f-11e7-9a86-08a2d081a8b9.png" height="280px">
  <p align="center">React renderer for creating PDFs — with multi-column layout support</p>
  <p align="center">
    <a href="https://github.com/rnichi1/react-column-pdf/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/rnichi1/react-column-pdf?style=flat&colorA=000000&colorB=000000" />
    </a>
  </p>
</p>

## What is this?

A React renderer for creating PDFs on the browser and server. Compatible with [@react-pdf/renderer](https://github.com/diegomura/react-pdf) but extends `View` and `Text` with column layout options for magazine-style and newspaper-like documents.

**Creating PDFs** — not displaying them. For viewing existing PDFs, see [react-pdf](https://github.com/wojtekmaj/react-pdf).

## Install

```sh
yarn add react-column-pdf
```

## Usage

```jsx
import { Document, Page, Text, View, StyleSheet } from 'react-column-pdf';

const styles = StyleSheet.create({
  page: { padding: 36 },
  block: { fontSize: 10, marginBottom: 8, textAlign: 'justify' },
});

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View columns={2} columnGap={18}>
        <Text style={styles.block}>Column one content…</Text>
        <Text style={styles.block}>Column two content…</Text>
      </View>
    </Page>
  </Document>
);
```

### In the browser

```jsx
import { PDFViewer } from 'react-column-pdf';

<PDFViewer>
  <MyDocument />
</PDFViewer>
```

### In Node

```jsx
import ReactPDF from 'react-column-pdf';

ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);
```

## License

MIT © [rnichi1](https://github.com/rnichi1)
