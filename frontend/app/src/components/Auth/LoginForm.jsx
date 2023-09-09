import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { loginUser } from '../../store/auth/actionCreators';
import { paths } from '../../paths/paths';
import bear from '../../images/bear.png';
import { login } from '../../services/login';

import { Button } from 'react-bootstrap';
import './loginForm.css';

const LoginForm = ({ changeAuth }) => {
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });

  const handlerOnChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlerOnSubmit = (event) => {
    event.preventDefault();

    dispatch(loginUser(userData));
    login(userData);
  };

  return (
    <div className="form-container">
      <div className="bear">
        <img src={bear} alt="Bear" />
      </div>
      <div className="form-content">
        <form className="form" onSubmit={handlerOnSubmit}>
          <h1 className="form-title">Войти</h1>
          <div className="form-floating">
            <input
              type="text"
              className="form-control-inputs"
              id="floatingInput"
              name="username"
              placeholder="Имя пользователя"
              value={userData.username}
              onChange={handlerOnChange}
            />
            <label htmlFor="floatingInput"></label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="password"
              id="floatingPassword"
              name="password"
              placeholder="Пароль"
              value={userData.password}
              onChange={handlerOnChange}
            />
            <label htmlFor="floatingPassword"></label>
          </div>
          <Button className="w-100 btn btn-lg btn-primary btn" type="submit">
            Войти
          </Button>
          <p className="changeOnLogin">
            Нет аккаунта?
            <span onClick={changeAuth} className="spanEntry">
              Регистрация
            </span>
          </p>
        </form>
        <div className="link-form">
          <Link className="link" to={paths.home}>
            Условия использования
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

// const LoginForm = ({ changeAuth }) => {
//   const dispatch = useAppDispatch();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//
//   const handlerOnSubmit = (event) => {
//     event.preventDefault();
//
//     dispatch(loginUser({ email, password }));
//     login({ email, password });
//   };
//   return (
//     <div className="form-container">
//       <div className="bear">
//         <img src={bear} />
//       </div>
//       <div className="form-content">
//         <form className="form" onSubmit={handlerOnSubmit}>
//           <h1 className="form-title">Войти</h1>
//           <div className="form-floating">
//             <input
//               type="text"
//               className="form-control-inputs"
//               id="floatingInput"
//               name="username"
//               placeholder="Имя пользователя"
//               onChange={(event) => setEmail(event.target.value)}
//             />
//             <label htmlFor="floatingInput"></label>
//           </div>
//           <div className="form-floating">
//             <input
//               type="password"
//               className="password"
//               id="floatingPassword"
//               name="password"
//               placeholder="Пароль"
//               onChange={(event) => setPassword(event.target.value)}
//             />
//             <label htmlFor="floatingPassword"></label>
//           </div>
//           <Button className="w-100 btn btn-lg btn-primary btn" type="submit">
//             Войти
//           </Button>
//           <p className="changeOnLogin">
//             Нет аккаунта?
//             <span onClick={changeAuth} className="spanEntry">
//               Регистрация
//             </span>
//           </p>
//         </form>
//         <div className="link-form">
//           <Link className="link" to={paths.home}>
//             Условия использования
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };
// const [state, setState] = useState({
//   username: '',
//   password: '',
// });
// const handlerOnChange = (event) => {
//   setState({
//     [event.target.name]: event.target.value,
//   });
// };
// const handlerOnSubmit = (event) => {
//   event.getToken(state.username, state.password);
//   event.preventDefault();
// };
// return (
//   <div className="form-container">
//     <div className="bear">
//       <img src={bear} />
//     </div>
//     <div className="form-content">
//       <form className="form" onSubmit={(event) => handlerOnSubmit(event)}>
//         <h1 className="form-title">Войти</h1>
//         <div className="form-floating">
//           <input
//             type="text"
//             className="form-control-inputs"
//             id="floatingInput"
//             name="username"
//             placeholder="Имя пользователя"
//             onChange={(event) => handlerOnChange(event)}
//           />
//           <label htmlFor="floatingInput"></label>
//         </div>
//         <div className="form-floating">
//           <input
//             type="password"
//             className="password"
//             id="floatingPassword"
//             name="password"
//             placeholder="Пароль"
//             onChange={(event) => handlerOnChange(event)}
//           />
//           <label htmlFor="floatingPassword"></label>
//         </div>
//         <Button className="w-100 btn btn-lg btn-primary btn" type="submit">
//           Войти
//         </Button>
//         <p className="changeOnLogin">
//           Нет аккаунта?
//           <span onClick={changeAuth} className="spanEntry">
//             Регистрация
//           </span>
//         </p>
//       </form>
//       <div className="link-form">
//         <Link className="link" to={paths.home}>
//           Условия использования
//         </Link>
//       </div>
//     </div>
//   </div>
// );
// };

// export default LoginForm;

// class LoginForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       username: '',
//       password: '',
//     };
//   }
//   handlerOnChange(event) {
//     this.setState({
//       [event.target.name]: event.target.value,
//     });
//   }

//   handlerOnSubmit(event) {
//     this.props.getToken(this.state.username, this.state.password);
//     event.preventDefault();
//   }

//   render() {
//     return (
//       <form
//         className="container-fluid align-items-center form form-control w-25"
//         onSubmit={(event) => this.handlerOnSubmit(event)}
//       >
//         <h1 className="h3 mb-3 fw-normal">Войти</h1>
//         <div className="form-floating">
//           <input
//             type="text"
//             className="form-control-inputs"
//             id="floatingInput"
//             name="username"
//             placeholder="Имя пользователя"
//             onChange={(event) => this.handlerOnChange(event)}
//           />
//           <label htmlFor="floatingInput"></label>
//         </div>
//         <div className="form-floating">
//           <input
//             type="password"
//             className="password"
//             id="floatingPassword"
//             name="password"
//             placeholder="Пароль"
//             onChange={(event) => this.handlerOnChange(event)}
//           />
//           <label htmlFor="floatingPassword"></label>
//         </div>
//         <Button className="w-100 btn btn-lg btn-primary btn" type="submit">
//           Войти
//         </Button>
//         <p className="changeOnLogin">
//           Нет аккаунта? <span className="spanEntry">Зарегистрироваться</span>
//         </p>
//       </form>
//     );
//   }
// }

// export default LoginForm;
