import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './registerForm.css';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { register } from '../../../services/register';
import { paths } from '../../../paths/paths';
import bear from '../../../images/bear.png';

const RegisterForm = ({ changeAuth }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [cookie, setCookie] = useCookies('');

  const handlerOnSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/users/', {
        username,
        email,
        password1,
        password2,
      });
      const cook = response.data.access;
      setCookie('cookie', cook);
      alert('Регистрация прошла успешно!');
    } catch (error) {
      alert('Ошибка при регистрации');
      console.error(error);
    }
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
              onChange={(event) => setUsername(event.target.value)}
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
              placeholder="Подтверждение пароля"
              value={password2}
              onChange={(event) => setPassword2(event.target.value)}
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
