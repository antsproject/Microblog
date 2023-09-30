import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { paths } from '../../paths/paths';
import fetchJson, { FetchError } from '../../session/fetchJson';
// import { setUserAndToken } from '../../redux/features/userSlice';
// import { useDispatch } from 'react-redux';
// import Router from "next/router";
import useUser from '../../session/useUser';

const LoginForm = ({ changeAuth, handleClosePopup }) => {
	// const dispatch = useDispatch();
	const { user } = useUser({});
	const [errors, setErrors] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const resetInputs = () => {
		setUsername('');
		setPassword('');
	};

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
				console.debug('Result of front login', success.response, success.user);
				// dispatch(setUserAndToken({'token': success.response, 'user': success.user}));
			}
			
			// dispatch(setToken(success.response));
			// dispatch(setUser(success.user));
			handleClosePopup();
			setErrors(false);
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
