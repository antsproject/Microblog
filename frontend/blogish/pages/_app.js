import { Provider } from 'react-redux';
import '../styles/App.css';
import store from '../redux/store/store';

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
