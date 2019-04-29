import App, { Container } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import theme from "../theme";

export default class extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <title>Northport Omena Calendar</title>
        </Head>
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <CssBaseline />
            <Component {...pageProps} />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </Container>
    );
  }
}
