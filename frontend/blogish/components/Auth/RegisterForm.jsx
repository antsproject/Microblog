import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { paths } from '../../paths/paths';
import RegistrationConfirm from './RegistrationConfirm.jsx';
import UserRequests from '../../api/requests/Users.js';
import UsersStruct from '../../api/struct/Users.js';
import { setToken, setUser } from '../../redux/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const RegisterForm = ({ changeAuth }) => {
    const tokenGlobal = useSelector((state) => state.global.data.token);
    // const tokenGlobal = '';
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState([]);
    const [confirm, setConfirm] = useState(false);

    const collectErrors = function (response) {
        let errors_strings = [];
        Object.keys(response.response.data).forEach((k, i) => {
            for (let error of response.response.data[k]) {
                errors_strings.push(error);
            }
        });
        setErrors(errors_strings);
        return errors_strings;
    };

    const handlerOnSubmit = async (event) => {
        event.preventDefault();

        // Request Struct
        const query = UsersStruct.register;
        query.email = email;
        query.password1 = password1;
        query.password2 = password2;
        query.username = username;

        // Use function
        UserRequests.register(query, function (success, response) {
            console.debug(success, response);
            if (success === true) {
                const token = response.data.access;
                dispatch(setToken(token));
                setErrors([]);
                setConfirm(true);
            } else {
                console.error(response);
                console.log(collectErrors(response));
            }
        });
    };
    return (
        <div className="form-container">
            <Image className="bear" src="/images/bear.png" width={302} height={697} alt="bear" />
            <div className="form-content">
                {confirm ? (
                    <RegistrationConfirm email={email} />
                ) : (
                    <form className="form" onSubmit={(event) => handlerOnSubmit(event)}>
                        <h1 className="form-title">Регистрация</h1>
                        <ul className="form-errors">
                            {errors.map((item) => (
                                <li>{item}</li>
                            ))}
                        </ul>
                        <div className="form-floating">
                            <label htmlFor="floatingInput"></label>
                            <input
                                type="text"
                                className="form-control-inputs"
                                id="floatingInputUsername"
                                name="username"
                                placeholder="Имя и фамилия"
                                value={username}
                                required
                                onChange={(event) =>
                                    dispatch(setUser(setUsername(event.target.value)))
                                }
                                // onChange={(event) => setUsername(event.target.value)}
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
                                required
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
                                required
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
                                required
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
                    <Link className="link" href={paths.home}>
                        Условия использования
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default RegisterForm;
