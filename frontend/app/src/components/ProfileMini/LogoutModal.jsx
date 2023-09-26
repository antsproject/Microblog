import React from "react";
import User from '../../images/user-03.svg';
import Shield from '../../images/shield-02.svg';
import Logout from '../../images/log-out-01.svg';
import Storage from "../../api/storage/Storage";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../features/userSlice';

const LogoutModal = ({ onCloseTrigger }) => {
  const dispatch = useDispatch();
  const user = Storage.getUser();

  const handleLogout = () => {
    // Добавьте здесь логику для выхода пользователя
    // Например, вызов функции для разлогинивания пользователя
    // Или перенаправление на страницу выхода

    // Закройте модальное окно после выполнения операции
    Storage.logout();
    dispatch(setToken(''));
    dispatch(setUser({}));
    onCloseTrigger();
  };

  return (
    <div>
      <Link to={`/user/${user.id}-${user.slug}`} className="profile-mini-text-elements">
        <img src={User} alt="user profile" />Мой профиль
      </Link>
      <Link to="/settings" className="profile-mini-text-elements">
        <img src={Shield} alt="settings" />Настройки
      </Link>
      <Link to="#" className="profile-mini-text-elements" onClick={handleLogout}>
        <img src={Logout} alt="logout" />Выйти
      </Link>
    </div>
  );
};

export default LogoutModal;