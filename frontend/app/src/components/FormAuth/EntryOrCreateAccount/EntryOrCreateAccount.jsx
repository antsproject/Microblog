import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EntryOrCreateAccount.css';
const EntryOrCreateAccount = () => {
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
    <form className="form-entryOrCreate" onSubmit={(event) => handlerOnSubmit(event)}>
      <h1 className="form-entryOrCreate__h1">
        Войдите или<br></br> создайте аккаунт{' '}
      </h1>
      <p>Вы сможете писать свои посты, вести свой блог и учавствовать в обсуждениях </p>
      <input
        type="text"
        className="form-entryOrCreate__input"
        id="floatingInputUsername"
        name="email"
        placeholder="Почта"
        onChange={(event) => handlerOnChange(event)}
      />
      <button className="form-entryOrCreate__btn">Войти</button>
      <p className="form-entryOrCreate__p">
        Нажимая «Войти», вы соглашаетесь c
        <Link className="form-entryOrCreate__link">Условиями использования</Link>
      </p>
    </form>
  );
};

export default EntryOrCreateAccount;
