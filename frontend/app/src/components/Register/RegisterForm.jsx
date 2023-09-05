import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './style.css';
import { paths } from '../../paths/paths';

const RegisterForm = ({ changeAuth }) => {
  const [state, setState] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const handlerOnChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
    });
  };
  const handlerOnSubmit = (event) => {
    const register = (event) => {
      const username = event.state.username;
      const email = event.state.email;
      const password = event.state.password;
      const password2 = event.state.password2;
    };

    event.preventDefault();
    return register;
  };
  return (
    <form
      className="container-fluid align-items-center form-control w-25"
      onSubmit={(event) => handlerOnSubmit(event)}
    >
      <h1 className="h3 mb-3 fw-normal">Регистрация</h1>

      <div className="form-floating">
        <label htmlFor="floatingInput"></label>
        <input
          type="text"
          className="form-control-inputs"
          id="floatingInputUsername"
          name="username"
          placeholder="Имя пользователя"
          onChange={(event) => handlerOnChange(event)}
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
          onChange={(event) => handlerOnChange(event)}
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
          onChange={(event) => handlerOnChange(event)}
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
          onChange={(event) => handlerOnChange(event)}
        />
      </div>
      <Button className="w-100 btn btn-lg btn-primary btn" type="submit">
        Зарегистрироваться
      </Button>
      <p className="changeOnLogin">
        Есть аккаунт?{' '}
        <span onClick={changeAuth} className="spanEntry">
          Войти
        </span>
      </p>
    </form>
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
