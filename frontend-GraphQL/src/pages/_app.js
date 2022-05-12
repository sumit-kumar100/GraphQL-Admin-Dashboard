import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import '../css/index.css'
import { ToastContainer } from 'react-toastify';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { ApolloProvider } from '@apollo/client/react';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { theme } from '../theme';
import { client } from '../utils/apollo-client';


const App = (props) => {

  const clientSideEmotionCache = createEmotionCache();

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ToastContainer />
        <CacheProvider value={emotionCache}>
          <Head>
            <title>
              Material Kit Pro
            </title>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
