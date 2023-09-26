import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
// import reportWebVitals from '.old/reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
  //<React.StrictMode>
  //  <Provider store={store}>
  //    <App />
  //  </Provider>
  //</React.StrictMode>,
);

//if ('serviceWorker' in navigator) {
//  window.addEventListener('load', () => {
//    navigator.serviceWorker
//      .register('/service-worker.js')
//      .then(registration => {
//        console.log('Service Worker registered with scope:', registration.scope);
//      })
//      .catch(error => {
//        console.error('Service Worker registration failed:', error);
//      });
//  });
//}

if ('serviceWorker' in navigator) {
  // Весь код регистрации у нас асинхронный.
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => navigator.serviceWorker.ready.then((worker) => {
      worker.sync.register('syncdata');
    }))
    .catch((err) => console.log(err));
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
