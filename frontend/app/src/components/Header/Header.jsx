import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ReactComponent as BellImg } from '../../images/bell.svg';
import { ReactComponent as MenuImg } from '../../images/menu.svg';
import { ReactComponent as LogoutImg } from '../../images/logout.svg';
import { ReactComponent as PlusImg } from '../../images/plus.svg';
import { ReactComponent as ClockImg } from '../../images/clock.svg';
import { ReactComponent as RocketImg } from '../../images/rocket-02.svg';
import { ReactComponent as ZapfastImg } from '../../images/zap-fast.svg';
import { ReactComponent as BookmarkImg } from '../../images/bookmark-check.svg';
import { ReactComponent as AdvImg } from '../../images/adv.svg';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Register/RegisterForm';
import './header.css';
import close from '../../images/close.svg';

const Header = ({ active, handleClosePopup }) => {
  const [change, setChange] = useState(false);
  const changeAuth = () => {
    setChange(!change);
  };
  return (
    <>
      <div className="header">
        <div className="header-left">
          <MenuImg style={{ cursor: 'pointer' }} /> <Link to="/">ANTs</Link>
        </div>
        <div className="header-center">
          <input type="text" placeholder="Поиск"></input>
          <button>
            <PlusImg /> Написать
          </button>
        </div>
        <div className="header-right">
          <BellImg style={{ cursor: 'pointer' }} />
          <LogoutImg onClick={handleClosePopup} style={{ cursor: 'pointer' }} />{' '}
          <p onClick={handleClosePopup} style={{ cursor: 'pointer' }}>
            Войти
          </p>
        </div>
      </div>

      <div className="wrapper">
        <div className="wrapper-left">
          <Link href="#" class="wrapper-left__link hovered">
            <RocketImg /> Популярное
          </Link>
          <Link to="/user" className="wrapper-left__link">
            <ClockImg /> Свежее
          </Link>
          <Link to="/subscriptions" className="wrapper-left__link">
            <ZapfastImg /> Подписки
          </Link>
          <Link to="/favorite" className="wrapper-left__link">
            <BookmarkImg /> Избранное
          </Link>
          <div className="wrapper-left__bottom">
            <Link href="#">Заказать рекламу</Link>
            <Link href="#">О проекте</Link>
            <Link href="#">Вакансии</Link>
          </div>
        </div>
        <div className="wrapper-center">
          <Outlet />
        </div>
        <div className="wrapper-right">
          <AdvImg />
        </div>
        {/* popup auth-form */}
        {active && (
          <div className="auth-shadow">
            <div className="auth-form">
              {change ? (
                <LoginForm changeAuth={changeAuth} />
              ) : (
                <RegisterForm changeAuth={changeAuth} />
              )}

              <p onClick={handleClosePopup} className="auth-close">
                <img src={close} />
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
