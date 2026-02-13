---
'react-column-pdf': patch
'@rnichi11/react-column-pdf-layout': patch
---

Fix multi-column pagination to avoid premature page breaks caused by pre-column height checks. Multi-column containers are now handled before generic split logic so content that fits across columns stays on the current page.
