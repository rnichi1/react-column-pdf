<p align="center">
  <img src="https://user-images.githubusercontent.com/5600341/27505816-c8bc37aa-587f-11e7-9a86-08a2d081a8b9.png" height="280px">
  <p align="center">React renderer for creating PDFs — with multi-column layout support</p>
  <p align="center">
    <a href="https://github.com/rnichi1/react-column-pdf/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/rnichi1/react-column-pdf?style=flat&colorA=000000&colorB=000000" />
    </a>
  </p>
</p>

## Install from GitHub

```sh
# Latest from main branch (run `yarn upgrade react-column-pdf` to pull updates)
yarn add react-column-pdf@github:rnichi1/react-column-pdf#main

# Pinned to a specific release
yarn add react-column-pdf@github:rnichi1/react-column-pdf#v1.0.0
```

When using `#main`, `yarn upgrade react-column-pdf` will fetch the latest without reinstalling the whole project.

Compatible with [@react-pdf/renderer](https://github.com/diegomura/react-pdf) but adds `columns` and `columnGap` props to `View` and `Text` for multi-column layouts.

**For viewing PDFs** (not creating them), see [react-pdf](https://github.com/wojtekmaj/react-pdf).

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

### Browser

```jsx
import { PDFViewer } from 'react-column-pdf';

<PDFViewer>
  <MyDocument />
</PDFViewer>
```

### Node

```jsx
import ReactPDF from 'react-column-pdf';

ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);
```

## License

MIT © [rnichi1](https://github.com/rnichi1)
