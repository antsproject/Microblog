import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import { ReactComponent as ClockImg } from '../../images/clock.svg';
import { ReactComponent as RocketImg } from '../../images/rocket-02.svg';
import { ReactComponent as ZapfastImg } from '../../images/zap-fast.svg';
import { ReactComponent as BookmarkImg } from '../../images/bookmark-check.svg';
import { ReactComponent as AdvImg } from '../../images/adv.svg';
import './wrapper.css';
const Wrapper = () => {
  return (
    <>
      <div className="wrapper">
        <div className="container-wrapper">
          <div className="wrapper-left">
            <Link to="/post" className="wrapper-left__link hovered">
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
        </div>
      </div>
    </>
  );
};

export default Wrapper;
