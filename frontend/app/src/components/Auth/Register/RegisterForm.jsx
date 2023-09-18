import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './registerForm.css';
import { useCookies } from 'react-cookie';
// import axios from 'axios';
// import { register } from '../../../services/register';
import { paths } from '../../../paths/paths';
import bear from '../../../images/bear.png';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../../features/tokenSlice';
import RegistrationConfirm from '../../RegistrationConfirm/RegistrationConfirm';


import UserRequests from '../../../api/requests/Users';
import UsersStruct from '../../../api/struct/Users';

const RegisterForm = ({ changeAuth }) => {
  const tokenGlobal = useSelector((state) => state.token.token);
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [cookie, setCookie] = useCookies('');

  const handlerOnSubmit = async (event) => {
    event.preventDefault();

    // Request Struct
    const query = UsersStruct.register;
    query.email = email;
    query.password1 = password1;
    query.password2 = password2;
    query.username = username;

    // Use function
    UserRequests.register(query, function(success, response) {
      console.debug(success, response);
      if(success === true) {
        const token = response.data.access;
        dispatch(setToken(token));
        setCookie('cookie', token);
        alert('Регистрация прошла успешно!');
      }
      else {
        alert('Ошибка при регистрации');
        console.error(response);
      }
    });

  };
  return (
    <div className="form-container">
      <img className="bear" src={bear} />
      <div className="form-content">
        {tokenGlobal ? (
          <RegistrationConfirm email={email} />
        ) : (
          <form className="form" onSubmit={(event) => handlerOnSubmit(event)}>
            <h1 className="form-title">Регистрация</h1>

            <div className="form-floating">
              <label htmlFor="floatingInput"></label>
              <input
                type="text"
                className="form-control-inputs"
                id="floatingInputUsername"
                name="username"
                placeholder="Имя и фамилия"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="form-floating">
              <label htmlFor="floatingInput"></label>
              <input
                type="email"
                className="form-control-inputs"
                id="floatingInputEmail"
                name="email"
                placeholder="Почта"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="form-floating">
              <label htmlFor="floatingPassword"></label>
              <input
                type="password"
                className=" password"
                id="floatingPassword"
                name="password"
                placeholder="Пароль"
                minLength={8}
                value={password1}
                onChange={(event) => setPassword1(event.target.value)}
              />
            </div>
            <div className="form-floating">
              <label htmlFor="floatingPassword"></label>
              <input
                type="password"
                className=" password"
                id="floatingPassword2"
                name="password2"
                placeholder="Повторить пароль"
                minLength={8}
                value={password2}
                onChange={(event) => setPassword2(event.target.value)}
              />
            </div>
            <button className="btn-red btn-register" type="submit">
              Зарегистрироваться
            </button>
            <p className="changeOnLogin">
              Есть аккаунт?{' '}
              <span onClick={changeAuth} className="spanEntry">
                Войти
              </span>
            </p>
          </form>
        )}

        <div className="link-form">
          <Link className="link" to={paths.home}>
            Условия использования
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

// class RegisterForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       first_name: '',
//       last_name: '',
//       username: '',
//       email: '',
//       password: '',
//       password2: '',
//     };
//   }
//   handlerOnChange(event) {
//     this.setState({
//       [event.target.name]: event.target.value,
//     });
//   }
//   handlerOnSubmit(event) {
//     this.props.register(
//       this.state.first_name,
//       this.state.last_name,
//       this.state.username,
//       this.state.email,
//       this.state.password,
//       this.state.password2,
//     );
//     event.preventDefault();
//   }
//   render() {
//     return (
//       <form
//         className="container-fluid align-items-center form form-control w-25"
//         onSubmit={(event) => this.handlerOnSubmit(event)}
//       >
//         <h1 className="h3 mb-3 fw-normal">Регистрация</h1>
//         <div className="form-floating">
//           <label htmlFor="floatingInput"></label>
//           <input
//             type="text"
//             className="form-control-inputs"
//             id="floatingInputName"
//             name="first_name"
//             placeholder="Имя"
//             onChange={(event) => this.handlerOnChange(event)}
//           />
//         </div>
//         <div className="form-floating">
//           <label htmlFor="floatingInput"></label>
//           <input
//             type="text"
//             className="form-control-inputs"
//             id="floatingInputLastName"
//             name="last_name"
//             placeholder="Фамилия"
//             onChange={(event) => this.handlerOnChange(event)}
//           />
//         </div>
//         <div className="form-floating">
//           <label htmlFor="floatingInput"></label>
//           <input
//             type="text"
//             className="form-control-inputs"
//             id="floatingInputUsername"
//             name="username"
//             placeholder="Имя пользователя"
//             onChange={(event) => this.handlerOnChange(event)}
//           />
//         </div>
//         <div className="form-floating">
//           <label htmlFor="floatingInput"></label>
//           <input
//             type="text"
//             className="form-control-inputs"
//             id="floatingInputEmail"
//             name="email"
//             placeholder="Почта"
//             onChange={(event) => this.handlerOnChange(event)}
//           />
//         </div>
//         <div className="form-floating">
//           <label htmlFor="floatingPassword"></label>
//           <input
//             type="password"
//             className=" password"
//             id="floatingPassword"
//             name="password"
//             placeholder="Пароль"
//             onChange={(event) => this.handlerOnChange(event)}
//           />
//         </div>
//         <div className="form-floating">
//           <label htmlFor="floatingPassword"></label>
//           <input
//             type="password"
//             className=" password"
//             id="floatingPassword2"
//             name="password2"
//             placeholder="Подтверждение пароля"
//             onChange={(event) => this.handlerOnChange(event)}
//           />
//         </div>
//         <Button className="w-100 btn btn-lg btn-primary btn" type="submit">
//           Зарегистрироваться
//         </Button>
//         <p className="changeOnLogin">
//           Есть аккаунт? <span className="spanEntry">Войти</span>
//         </p>
//       </form>
//     );
//   }
// }
// export default RegisterForm;
