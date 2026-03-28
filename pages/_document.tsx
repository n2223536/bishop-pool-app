import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
          <meta name="theme-color" content="#0066cc" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;