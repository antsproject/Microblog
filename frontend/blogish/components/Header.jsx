import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
// import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import Link from 'next/link';
import Image from 'next/image.js';
import LoginForm from './Auth/LoginForm.jsx';
import RegisterForm from './Auth/RegisterForm.jsx';
import ProfileMini from './ProfileMini.jsx';
// import { ReactComponent as BellImg } from '../images/bell.svg';
// import { ReactComponent as MenuImg } from '../images/menu.svg';
// import { ReactComponent as LogoutImg } from '../images/logout.svg';
// import { ReactComponent as PlusImg } from '../images/plus.svg';
// import close from '../images/close.svg';

const Header = ({ active, handleClosePopup }) => {
  const token = useSelector((state) => state.global.data.token);

  const [change, setChange] = useState(false);

  const changeAuth = () => {
    setChange(!change);
  };
  return (
    <>
      <div className="header">
        <div className="container-header">
          <div className="header-left">
            {/* <MenuImg style={{ cursor: 'pointer' }} /> */}
            <Image src="/images/menu.svg" width={35} height={35} /> <Link href="/">Блогиш</Link>
          </div>
          <div className="header-center">
            <input className="header-input" type="text" placeholder="Поиск"></input>
            {token ? (
            <Link href="/create">
              <button>
                <Image src="/images/plus.svg" width={24} height={24} /> Написать
              </button>
            </Link> 
            ): (
              <button onClick={handleClosePopup}>
                <Image src="/images/plus.svg" width={24} height={24} /> Написать
              </button>
            )}

          </div>
          <div className={token ? 'header-right-login' : 'header-right'}>
            {/* <BellImg style={{ cursor: 'pointer' }} /> */}
            <Image width={35} height={35} src="/images/bell.svg" />
            {token ? (
              <ProfileMini />
            ) : (
              <>
                <Image
                  style={{ cursor: 'pointer' }}
                  onClick={handleClosePopup}
                  src="/images/logout.svg"
                  width={35}
                  height={35}
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
