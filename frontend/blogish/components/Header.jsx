import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image.js';
import LoginForm from './Auth/LoginForm.jsx';
import RegisterForm from './Auth/RegisterForm.jsx';
import ProfileMini from './ProfileMini.jsx';
import { useSelector } from 'react-redux';
import Router from 'next/router.js';

const Header = ({ active, handleClosePopup }) => {
    const user = useSelector((state) => state.user.value);

    const [change, setChange] = useState(false);

    const changeSearchHandle = (event) => {
        if (event.which == 13) {
            const new_search_value = event.target.value;
            console.log("On search", new_search_value);
            Router.push({ pathname: '/search', query: { 's': new_search_value } });
        }
    };

    const changeAuth = () => {
        setChange(!change);
    };

    return (
        <>
            <div className="header">
                <div className="container-header">
                    <div className="header-left">
                        <Image src="/images/menu.svg" width={35} height={35} alt="menu" /> <Link href="/">Блогиш</Link>
                    </div>
                    <div className="header-center">
                        <input className="header-input" type="text" placeholder="Поиск" onKeyUp={changeSearchHandle}></input>
                        {user ? (
                            <Link href="/create">
                                <button>
                                    <Image src="/images/plus.svg" width={24} height={24} alt="plus" /> Написать
                                </button>
                            </Link>
                        ) : (
                            <button onClick={handleClosePopup}>
                                <Image src="/images/plus.svg" width={24} height={24} alt="plus" /> Написать
                            </button>
                        )}

                    </div>
                    <div className={user ? 'header-right-login' : 'header-right'}>
                        <Image width={35} height={35} src="/images/bell.svg" alt="bell" />
                        {user ? (
                            <ProfileMini />
                        ) : (
                            <>
                                <Image
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleClosePopup}
                                    src="/images/logout.svg"
                                    width={35}
                                    height={35}
                                    alt="logout"
                                />{' '}
                                <p
                                    className="header-right__p"
                                    onClick={handleClosePopup}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Войти
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* popup auth-form */}
            {active && (
                <div className="auth-shadow">
                    <div className="auth-form">
                        {change ? (
                            <LoginForm handleClosePopup={handleClosePopup} changeAuth={changeAuth} />
                        ) : (
                            <RegisterForm changeAuth={changeAuth} />
                        )}

                        <p onClick={handleClosePopup} className="auth-close">
                            <Image src="/images/close.svg" width={19} height={19} alt="close" />
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
