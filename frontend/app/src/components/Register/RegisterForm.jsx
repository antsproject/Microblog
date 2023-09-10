import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './registerForm.css';
import { register } from '../../services/register';
import { paths } from '../../paths/paths';
import bear from '../../images/bear.png';

const RegisterForm = ({ changeAuth }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const handlerOnChangeUsername = (event) => {
    setUsername(event.target.value);
  };
  const handlerOnChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlerOnChangePassword = (event) => {
    setPassword1(event.target.value);
  };
  const handlerOnChangePassword2 = (event) => {
    setPassword2(event.target.value);
  };
  const handlerOnSubmit = (event) => {
    event.preventDefault();

    const userData = {
      username: username,
      email: email,
      password1: password1,
      password2: password2,
    };

    return register(userData);
  };

  //   const handlerOnSubmit = (event) => {
  //     event.preventDefault();
  //
  //     // const register = ({ username }) => {
  //     //   const username = event.username;
  //     //   const email = event.email;
  //     //   const password = event.password;
  //     //   const password2 = event.password2;
  //     // };
  //
  //     return register({ username, email, password1, password2 });
  //   };
  return (
    <div className="form-container">
      <img className="bear" src={bear} />
      <div className="form-content">
        <form className="form" onSubmit={(event) => handlerOnSubmit(event)}>
          <h1 className="form-title">Регистрация</h1>

          <div className="form-floating">
            <label htmlFor="floatingInput"></label>
            <input
              type="text"
              className="form-control-inputs"
              id="floatingInputUsername"
              name="username"
              placeholder="Имя пользователя"
              value={username}
              onChange={(event) => handlerOnChangeUsername(event)}
            />
          </div>
          <div className="form-floating">
            <label htmlFor="floatingInput"></label>
            <input
              type="text"
              className="form-control-inputs"
              id="floatingInputEmail"
              name="email"
              placeholder="Почта"
              value={email}
              onChange={(event) => handlerOnChangeEmail(event)}
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
              value={password1}
              onChange={(event) => handlerOnChangePassword(event)}
            />
          </div>
          <div className="form-floating">
            <label htmlFor="floatingPassword"></label>
            <input
              type="password"
              className=" password"
              id="floatingPassword2"
              name="password2"
              placeholder="Подтверждение пароля"
              value={password2}
              onChange={(event) => handlerOnChangePassword2(event)}
            />
          </div>
          <button className=" btn" type="submit">
            Зарегистрироваться
          </button>
          <p className="changeOnLogin">
            Есть аккаунт?{' '}
            <span onClick={changeAuth} className="spanEntry">
              Войти
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
