import App, { Container } from "next/app";
import NextHead from "next/head";
import React from "react";
import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";

import createStore from "../store";

class ChicagoApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <NextHead>
          <meta charSet="UTF-8" />
          <title key="title">Chicago Employees</title>
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,shrink-to-fit=no"
          />
          <meta
            name="description"
            content="Chigado Employement Directory"
            key="description"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <link rel="icon" href="/static/favicon.ico" />
          <link rel="stylesheet" href="/static/bulma.min.css" />
        </NextHead>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withRedux(createStore)(
  withReduxSaga({ async: true })(ChicagoApp)
);
