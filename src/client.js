import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import App from "./react/App.jsx";

Sentry.init({
  dsn: "https://6d26c7e100a84ae2ae01f54719c5ca19@o912155.ingest.sentry.io/5848955",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,
});

const { locale, messages } = JSON.parse(window.App);

const link = new HttpLink({
  uri: "/graphql"
});

const client = new ApolloClient({
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  link,
  ssrForceFetchDelay: 100
});

hydrate(
  <ApolloProvider client={client}>
    <IntlProvider locale={locale} messages={messages}>
      <BrowserRouter>
        <ThemeProvider theme={createMuiTheme()}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </IntlProvider>
  </ApolloProvider>,
  document.getElementById("app")
);
