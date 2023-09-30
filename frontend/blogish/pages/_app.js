import { Provider } from 'react-redux';
import '../styles/App.css';
import store from '../redux/store/store';
import { SWRConfig } from "swr";
import fetchJson from '../session/fetchJson';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <SWRConfig
        value={{
          fetcher: fetchJson,
          onError: (err) => {
            console.error(err);
          },
        }}
      >
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </SWRConfig>
    </>
  );
}
