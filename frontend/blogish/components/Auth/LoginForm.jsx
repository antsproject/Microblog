import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { paths } from '../../paths/paths';
import { Button } from '../Button';
import UserRequests from '../../api/requests/Users.js';
import UsersStruct from '../../api/struct/Users.js';
import { setUser, setToken } from '../../redux/features/userSlice';
import Storage from '../../api/storage/Storage';
import { useDispatch } from 'react-redux';

const LoginForm = ({ changeAuth, handleClosePopup }) => {
    const dispatch = useDispatch();
    // const tokenGlobal = useSelector((state) => state.token.token);
    const [errors, setErrors] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const resetInputs = () => {
        setUsername('');
        setPassword('');
    };

    const handlerOnSubmit = async (event) => {
        event.preventDefault();

        // Request Struct
        const query = UsersStruct.login;
        query.email = username;
        query.password = password;

        // Use function
        UserRequests.login(query, function (success, response) {
            console.debug(success, response);
            if (success === true) {
                dispatch(setToken(Storage.getToken()));
                dispatch(setUser(Storage.getUser()));
                handleClosePopup();
                setErrors(false);
                console.log('good');
                // toast.success('Вход выполнен успешно!');
            } else {
                // toast.error('Ошибка при входе');
                resetInputs();
                console.error(response);
                setErrors(true);
            }
        });
    };

    return (
        <div className="form-container">
            <div className="bear">
                <Image
                    className="bear"
                    src="/images/bear.png"
                    width={302}
                    height={697}
                    alt="bear"
                />
            </div>
            <div className="form-content">
                <form className="form" onSubmit={handlerOnSubmit}>
                    <h1 className="form-title">Войти</h1>
                    {errors ? (
                        <div className="form-errors">Введен неправильный логин или пароль</div>
                    ) : (
                        <></>
                    )}
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control-inputs"
                            id="floatingInput"
                            name="username"
                            placeholder="Почта"
                            value={username}
                            required
                            onChange={(event) => setUsername(event.target.value)}
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
                            minLength={8}
                            value={password}
                            required
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <label htmlFor="floatingPassword"></label>
                    </div>
                    {/* <Button className="btn-red btn-register" type="submit"> */}
                    <button className="btn-red btn-register" type="submit">
                        Войти
                    </button>
                    <p className="changeOnLogin">
                        Нет аккаунта?{' '}
                        <span onClick={changeAuth} className="spanEntry">
                            Регистрация
                        </span>
                    </p>
                </form>
                <div className="link-form">
                    <Link className="link" href={paths.home}>
                        Условия использования
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default LoginForm;
