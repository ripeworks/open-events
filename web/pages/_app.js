import "antd/dist/antd.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/app.css";
import "../styles/header.css";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
