import Document, { Html, Head, Main, NextScript } from "next/document";
const GA_ID = process.env.GA_ID;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <script
            type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCFl6qbeWVjcpMSz0L5pRu257-ZLwBCAHQ&libraries=places"
          />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
    `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
