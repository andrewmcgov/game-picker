import React from 'react';
import App from 'next/app';
import {ThemeProvider} from '@material-ui/core/styles';
import Layout from '../components/Layout';
import {withApollo} from '../lib/apollo';
import theme from '../lib/theme';

class MyApp extends App {
  render() {
    const {Component, pageProps} = this.props;
    return (
      <Layout>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </Layout>
    );
  }
}

export default withApollo(MyApp);
