import "antd/dist/antd.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-responsive-modal/styles.css";
import "../styles/app.css";
import "../styles/header.css";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
