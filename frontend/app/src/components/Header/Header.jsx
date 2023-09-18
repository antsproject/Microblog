import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Link } from 'react-router-dom';
import { ReactComponent as BellImg } from '../../images/bell.svg';
import { ReactComponent as MenuImg } from '../../images/menu.svg';
import { ReactComponent as LogoutImg } from '../../images/logout.svg';
import { ReactComponent as PlusImg } from '../../images/plus.svg';
import './header.css';
import LoginForm from '../Auth/Login/LoginForm.jsx';
import RegisterForm from '../Auth/Register/RegisterForm.jsx';
import close from '../../images/close.svg';
import ProfileMini from '../ProfileMini/ProfileMini.jsx';

const Header = ({ active, handleClosePopup }) => {
  const token = useSelector((state) => state.token.token);
  const [change, setChange] = useState(false);
  const changeAuth = () => {
    setChange(!change);
  };
  return (
    <>
      <div className="header">
        <div className="container-header">
          <div className="header-left">
            <MenuImg style={{ cursor: 'pointer' }} /> <Link to="/">Блогиш</Link>
          </div>
          <div className="header-center">
            <input className="header-input" type="text" placeholder="Поиск"></input>
            <button>
              <PlusImg /> Написать
            </button>
          </div>
          <div className={token ? 'header-right-login' : 'header-right'}>
            <BellImg style={{ cursor: 'pointer' }} />
            {token ? (
              <ProfileMini />
            ) : (
              <>
                <LogoutImg onClick={handleClosePopup} style={{ cursor: 'pointer' }} />{' '}
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
              <img src={close} />
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
