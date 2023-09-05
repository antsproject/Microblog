import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import './style.css';

const LoginForm = ({ changeAuth }) => {
  const [state, setState] = useState({
    username: '',
    password: '',
  });
  const handlerOnChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
    });
  };
  const handlerOnSubmit = (event) => {
    event.getToken(state.username, state.password);
    event.preventDefault();
  };
  return (
    <form
      className="container-fluid align-items-center form form-control w-25"
      onSubmit={(event) => handlerOnSubmit(event)}
    >
      <h1 className="h3 mb-3 fw-normal">Войти</h1>
      <div className="form-floating">
        <input
          type="text"
          className="form-control-inputs"
          id="floatingInput"
          name="username"
          placeholder="Имя пользователя"
          onChange={(event) => handlerOnChange(event)}
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
          onChange={(event) => handlerOnChange(event)}
        />
        <label htmlFor="floatingPassword"></label>
      </div>
      <Button className="w-100 btn btn-lg btn-primary btn" type="submit">
        Войти
      </Button>
      <p className="changeOnLogin">
        Нет аккаунта?
        <span onClick={changeAuth} className="spanEntry">
          Зарегистрироваться
        </span>
      </p>
    </form>
  );
};

export default LoginForm;

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
