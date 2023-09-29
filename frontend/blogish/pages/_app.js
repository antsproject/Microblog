import { Provider } from 'react-redux';

// import '../styles/Activation.css'
// import '../styles/EntryOrCreateAccount.css'
// import '../styles/FormAuth.css'
// import '../styles/header.module.css'
// import '../styles/Home.module.css'
// import '../styles/loginForm.module.css'
// import '../styles/ProfileMini.module.css'
// import '../styles/registerForm.module.css'
// import '../styles/RegistrationConfirm.module.css'
// import '../styles/wrapper.module.css'
import '../styles/App.css';
import store from '../redux/store/store';
// import RestoreSession from '../components/RestoreSession';
// import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
