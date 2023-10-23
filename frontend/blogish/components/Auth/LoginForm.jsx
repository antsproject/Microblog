import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { paths } from '../../paths/paths';
import fetchJson, { FetchError } from '../../session/fetchJson';
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setRefreshToken } from '../../redux/slices/tokenSlice';
import { setUser } from '../../redux/slices/userSlice';
import Microservices from '../../api/Microservices';
import Endpoints from '../../api/Endpoints';

const LoginForm = ({ changeAuth, handleClosePopup }) => {
	const user = useSelector((state) => state.user.value);
	const token = useSelector((state) => state.token);
	const dispatch = useDispatch();
	const [errors, setErrors] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const resetInputs = () => {
		setUsername('');
		setPassword('');
	};

	const refreshTime = 15000;

	// Создайте функцию для обновления accessToken с использованием refreshToken
	const refreshAccessToken = async (refreshToken) => {
		const body = {
			refresh: refreshToken,
		};

		try {
			const response = await fetchJson("http://127.0.0.1:8080/api/auth/refresh/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			let response_body = response;

			if (!response_body.access) {
				console.error("Ошибка запроса обновления accessToken");
				return null;
			}
			console.log("Ответ целиком: ", response_body);
			console.log("Поле access: ", response_body.access);
			return response_body.access;
		} catch (error) {
			console.error("Ошибка при обновлении accessToken", error);
			return null;
		}
	};

	useEffect(() => {
		let intervalId;

		const handleRefresh = async () => {
			if (token && token.refreshToken) {
				console.log("handleRefresh работает")
				const refreshedAccessToken = await refreshAccessToken(token.refreshToken);
				console.log("Результат работы функции, должно передать access: ", refreshedAccessToken)
				if (refreshedAccessToken) {
					dispatch(setToken(refreshedAccessToken));
				}
			}
		};

		if (user && token && token.refreshToken) {
			console.log("Интервал работает")
			intervalId = setInterval(handleRefresh, refreshTime);
		}

		return () => {
			if (intervalId && (!user || !token || !token.refreshToken)) {
				console.log("Очистка интервала");
				clearInterval(intervalId);
			}
		};
	}, [user, token, dispatch]);

	const handlerOnSubmit = async (event) => {
		event.preventDefault();
		const body = {
			email: username,
			password: password,
		};
		try {
			const success = await fetchJson("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (success.user && success.response) {
				dispatch(setUser(success.user));
				dispatch(setToken(success.response));
				handleClosePopup();
				setErrors(false);

				if (success.response.refresh) {
					dispatch(setRefreshToken(success.response.refresh));
				}
			}

			// Router.push("/");
		} catch (error) {
			if (error instanceof FetchError) {
				console.error(error.data.message);
			} else {
				console.error("An unexpected error happened:", error);
			}
			resetInputs();
			setErrors(true);
		}
	};

	return (
		<div className="form-container">
			<div className="bear">
				<Image className="bear" src="/images/bear.png" width={302} height={697} alt="bear" />
			</div>
			<div className="form-content">
				<form className="form" onSubmit={handlerOnSubmit}>
					<h1 className="form-title">Войти</h1>
					{errors ? <div className="form-errors">Введен неправильный логин или пароль</div> : <></>}
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