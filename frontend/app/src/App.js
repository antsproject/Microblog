import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import User from './pages/User';
import Layout from './pages/Layout/Layout';
import Home from './pages/Home/Home';
import Nopage from './pages/Nopage';
import './App.css';
import { paths } from './paths/paths';
import LoginForm from './components/Auth/Login/LoginForm';
import RegisterForm from './components/Auth/Register/RegisterForm';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={paths.user} element={<User />} />
          <Route path="*" element={<Nopage />} />
          <Route path={paths.login} element={<LoginForm />} />
          <Route path={paths.register} element={<RegisterForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       users: [],
//       projects: [],
//       tasks: [],
//       token: '',
//     };
//   }

//   logout() {
//     this.setToken('');
//   }
//   register(username, email, password1, password2) {
//     axios
//       .post('http://127.0.0.1:8000/api/register/', {
//         username: username,
//         email: email,
//         password1: password1,
//         password2: password2,
//       })
//       .then((response) => {})
//       .catch((error) => alert('Что то пошло не так'));
//     alert('Done!');
//   }

//   getToken(username, password) {
//     axios
//       .post('http://127.0.0.1:8000/api/jwt-token/', { username: username, password: password })
//       .then((response) => {
//         this.setToken(response.data['access'], username);
//       })
//       .catch((error) => alert('Неверный логин или пароль'));
//   }

//   getTokenFromStorage() {
//     const cookies = new Cookies();
//     const token = cookies.get('token');
//     const username = cookies.get('username');
//     this.setState({ token: token, username: username }, () => this.loadData());
//   }

//   setToken(token, username) {
//     const cookies = new Cookies();
//     cookies.set('token', token);
//     cookies.set('username', username);
//     this.setState({ token: token, username: username }, () => this.loadData());
//   }

//   loadData() {
//     const headers = this.getHeaders();
//     axios.get('http://127.0.0.1:8000/swagger/', { headers }).catch((error) => console.log(error));
//   }

//   getHeaders() {
//     let headers = {
//       'Content-Type': 'application/json',
//     };
//     if (this.isAuthenticated()) {
//       headers['Authorization'] = `Bearer ${this.state.token}`;
//     }
//     return headers;
//   }

//   isAuthenticated() {
//     return this.state.token !== '';
//   }
//   componentDidMount() {
//     this.getTokenFromStorage();
//   }

//   render() {
//     return (
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Layout />}>
//             <Route index element={<Home />} />
//             <Route path="/user" element={<User />} />
//             <Route path="*" element={<Nopage />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     );
//   }
// }
// export default App;
